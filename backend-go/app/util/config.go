package util

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
)

type User struct {
	UserID   int    `json:"user_id"`
	LongName string `json:"long_name"`
}

type Device struct {
	DeviceName string `json:"device_name"`
	DeviceID   int    `json:"device_id"`
}

type Config struct {
	AdminEmail                string `json:"admin_email"`
	User                      User   `json:"user"`
	Device                    Device `json:"device"`
	PufferAnzahl              uint   `json:"puffer_anzahl"`
	T1_Min_Default            uint8  `json:"t1_min_default"`
	T2_Stop_Default           uint8  `json:"t2_stop_default"`
	T3_Min_Default            uint8  `json:"t3_min_default"`
	T4_Stop_Default           uint8  `json:"t4_stop_default"`
	ZK_Einschaltpunkt_Default int8   `json:"zk_einschalt_punkt"`
	AnlageTyp                 string `json:"anlage_typ"`
	WpSteuerungOption         string `json:"wp_steuerung_option"`
	HeatingAdjustMode         bool   `json:"heating_adjust_mode"`
}

// AppConfig; Global variables
var (
	AppConfig  *Config
	configPath string = "./config.json"
)

func LoadConfig() error {
	file, err := os.Open(configPath)
	if err != nil {
		return fmt.Errorf("cannot open config file: %v", err)
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		return fmt.Errorf("cannot read config file: %v", err)
	}

	if err := json.Unmarshal(bytes, &AppConfig); err != nil {
		return fmt.Errorf("cannot parse config file: %v", err)
	}

	fmt.Printf("Config: %v", AppConfig)

	return nil
}
