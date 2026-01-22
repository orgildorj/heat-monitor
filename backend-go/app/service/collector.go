// service/collector.go
package service

import (
	"context"
	"errors"
	"fmt"
	"hm-backend/config"
	"hm-backend/model"
	"log"
	"strconv"

	"github.com/jackc/pgx/v5/pgconn"
	hreg_client "github.com/orgildorj/hreg-client"
	"gorm.io/gorm"
)

type HeatingDataCollector struct {
	configMgr  *config.ConfigManager
	db         *gorm.DB
	hregClient *hreg_client.APIClient
	hregCtx    context.Context
}

func NewHeatingDataCollector(configMgr *config.ConfigManager, db *gorm.DB) *HeatingDataCollector {
	cfg := configMgr.Get()

	hregCfg := hreg_client.NewConfiguration()

	return &HeatingDataCollector{
		configMgr:  configMgr,
		db:         db,
		hregClient: hreg_client.NewAPIClient(hregCfg),
		hregCtx:    context.WithValue(context.Background(), hreg_client.ContextAccessToken, cfg.Hreg.Token),
	}
}

/*
FetchHeatingData retrieves current heating system data from cloud API

 1. loop through parameters
    - fetch data

 2. save in db
*/
func (c *HeatingDataCollector) fetchHeatingData(customerConfig config.CustomerConfig) ([]*model.HeatingData, error) {
	cfg := c.configMgr.Get()

	var result []*model.HeatingData

	for _, p := range cfg.Hreg.Paramaters {
		resp, _, err := c.hregClient.DefaultAPI.ApiParamUpDeviceIdParamIdGet(c.hregCtx, fmt.Sprint(customerConfig.DeviceId), fmt.Sprint(p.ParamId)).Execute()
		if err != nil {
			return nil, fmt.Errorf("Error when running fetchHeatingData: %v", err)
		}

		var f64Value float64
		if resp.GetValueStr() == "" {
			f64Value = 0
		} else {
			f64Value, err = strconv.ParseFloat(resp.GetValueStr(), 64)

			if err != nil {
				return nil, fmt.Errorf("Error when converting param_id: %v ValueStr: %v to Float64: %v", p.ParamId, resp.GetValueStr(), err)
			}
		}

		heatingData := model.HeatingData{
			CustomerId: customerConfig.UserId,
			ColName:    p.ColName,
			Label:      p.Label,
			Value:      f64Value,
			Time:       resp.GetUpTime(),
		}

		result = append(result, &heatingData)

		if err := c.db.Create(&heatingData).Error; err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) {
				if pgErr.Code == "23505" {
					log.Println("HeatingData already exists.")
				} else {
					return nil, fmt.Errorf("Error when creating instance of HeatingData: %v", err)
				}
			}
		}

	}

	return result, nil
}

func (c *HeatingDataCollector) fetchLastOnline(responseDatas *[]HeatingDataResponse) error {
	resp, _, err := c.hregClient.DefaultAPI.ApiDeviceGet(c.hregCtx).Execute()
	if err != nil {
		return fmt.Errorf("Error when running fetchHeatingData: %v", err)
	}

	for i := range *responseDatas {
		for _, device := range resp.GetDevices() {
			if device.DeviceId == float32((*responseDatas)[i].DeviceId) {
				(*responseDatas)[i].LastUpdated = device.GetLastTimeOnline()
				break
			}
		}
	}
	return nil
}

func heatingDataToResponse(dataList []*model.HeatingData) map[string]*ParameterData {
	parameters := make(map[string]*ParameterData)

	for _, data := range dataList {
		parameters[data.ColName] = &ParameterData{
			Label: data.Label,
			Value: data.Value,
		}
	}

	return parameters
}

/*
FetchAllCustomerData retrieves data for all configured devices
1. loop through devices
  - invoke FetchHeatingData
*/
func (c *HeatingDataCollector) FetchAllCustomerData() ([]HeatingDataResponse, error) {
	cfg := c.configMgr.Get()

	var currentData []HeatingDataResponse

	for i := 0; i < len(cfg.Hreg.Customers); i++ {
		customerConfig := cfg.Hreg.Customers[i]
		heatingDatas, err := c.fetchHeatingData(customerConfig)
		if err != nil {
			return nil, err
		}

		currentData = append(currentData, HeatingDataResponse{
			CustomerId:   customerConfig.UserId,
			DeviceId:     customerConfig.DeviceId,
			CustomerName: customerConfig.LongName,
			Parameters:   heatingDataToResponse(heatingDatas),
		})
	}

	err := c.fetchLastOnline(&currentData)
	if err != nil {
		return nil, err
	}

	return currentData, nil

}
