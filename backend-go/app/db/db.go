package db

import (
	"fmt"
	"hm-backend/config"
	"hm-backend/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func initCustomers(configMgr *config.ConfigManager, db *gorm.DB) error {
	db.AutoMigrate(&model.Customer{})

	cfg := configMgr.Get()
	for _, c := range cfg.Hreg.Customers {
		newCustomer := model.Customer{
			UserId:   c.UserId,
			LongName: c.LongName,
			DeviceId: c.DeviceId,
		}

		if err := db.Where(model.Customer{UserId: c.UserId}).FirstOrCreate(&newCustomer).Error; err != nil {
			return fmt.Errorf("Error when initializing Customer: %v", err)
		}
	}

	return nil
}

func Init(configMgr *config.ConfigManager) (*gorm.DB, error) {
	cfg := configMgr.Get()

	db, err := gorm.Open(postgres.Open(cfg.GetDBConnectionString()), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	err = initCustomers(configMgr, db)
	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&model.HeatingData{})

	return db, nil
}
