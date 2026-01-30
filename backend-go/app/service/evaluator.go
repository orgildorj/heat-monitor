package service

import (
	"context"
	"hm-backend/config"

	hreg_client "github.com/orgildorj/hreg-client"
	"gorm.io/gorm"
)

type EvaluationResponse struct {
	CustomerId int
	DeviceId   int
	Status     string
}

type HeatingEvaluator struct {
	configMgr  *config.ConfigManager
	db         *gorm.DB
	hregClient *hreg_client.APIClient
	hregCtx    context.Context
}

func NewHeatingEvaluator(configMgr *config.ConfigManager, db *gorm.DB) *HeatingEvaluator {
	cfg := configMgr.Get()
	hregCfg := hreg_client.NewConfiguration()

	return &HeatingEvaluator{
		configMgr:  configMgr,
		db:         db,
		hregClient: hreg_client.NewAPIClient(hregCfg),
		hregCtx:    context.WithValue(context.Background(), hreg_client.ContextAccessToken, cfg.Hreg.Token),
	}
}

func (e *HeatingEvaluator) fetchLastOnline(deviceId int) error {
	// resp, _, err := e.hregClient.DefaultAPI.ApiDeviceGet(e.hregCtx).Execute()
	// if err != nil {
	// 	return fmt.Errorf("Error when running fetchHeatingData: %v", err)
	// }

	return nil
}

func (e *HeatingEvaluator) Evaluate(customerConfig config.CustomerConfig) ([]EvaluationResponse, error) {
	return []EvaluationResponse{}, nil
}

func (e *HeatingEvaluator) determineStatus() string {

	return "NORMAL"
}
