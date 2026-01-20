package config

import (
	"encoding/json"
	"fmt"
	"os"
	"sync/atomic"
)

type CustomerConfig struct {
	UserId   int    `json:"user_id"`
	LongName string `json:"long_name"`
	DeviceId int    `json:"device_id"`
}

type ParameterConfig struct {
	ParamId int    `json:"param_id"`
	Label   string `json:"label"`
	ColName string `json:"col_name"`
}

type HregConfig struct {
	Token              string            `json:"token"`
	CollectIntervalMin int               `json:"collect_interval_min"`
	Customers          []CustomerConfig  `json:"customers"`
	Paramaters         []ParameterConfig `json:"parameters"`
}

type DBConfig struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Name     string `json:"name"`
	User     string `json:"user"`
	Password string `json:"password"`
}

type BackendConfig struct {
	Port int `json:"port"`
}

type Config struct {
	Backend BackendConfig `json:"backend"`
	Hreg    HregConfig    `json:"hreg"`
	DB      DBConfig      `json:"db"`
}

type ConfigManager struct {
	config   atomic.Value
	filePath string
}

func NewConfigManager(filePath string) (*ConfigManager, error) {
	m := &ConfigManager{
		filePath: filePath,
	}

	// Load initial config from file
	if err := m.LoadFromFile(); err != nil {
		return nil, err
	}

	return m, nil
}

func (m *ConfigManager) Get() *Config {
	return m.config.Load().(*Config)
}

func (m *ConfigManager) Update(newConfig *Config) error {
	// Validate
	if err := m.validate(newConfig); err != nil {
		return fmt.Errorf("invalid config: %w", err)
	}

	// Save to file first
	if err := m.saveToFile(newConfig); err != nil {
		return fmt.Errorf("failed to save config: %w", err)
	}

	// Update in-memory
	m.config.Store(newConfig)

	return nil
}

func (m *ConfigManager) LoadFromFile() error {
	data, err := os.ReadFile(m.filePath)
	if err != nil {
		return fmt.Errorf("failed to read config file: %w", err)
	}

	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return fmt.Errorf("failed to parse config JSON: %w", err)
	}

	if err := m.validate(&cfg); err != nil {
		return fmt.Errorf("config validation failed: %w", err)
	}

	m.config.Store(&cfg)
	return nil
}

func (m *ConfigManager) saveToFile(cfg *Config) error {
	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}

	// Write to temp file first, then rename (atomic)
	tempFile := m.filePath + ".tmp"
	if err := os.WriteFile(tempFile, data, 0644); err != nil {
		return err
	}

	return os.Rename(tempFile, m.filePath)
}

func (m *ConfigManager) validate(cfg *Config) error {
	if cfg.Hreg.Token == "" {
		return fmt.Errorf("hreg.token is required")
	}

	if cfg.Hreg.CollectIntervalMin < 1 {
		return fmt.Errorf("hreg.collect_interval_min must be at least 1")
	}

	if cfg.DB.Host == "" {
		return fmt.Errorf("db.host is required")
	}

	if cfg.DB.Port == 0 {
		return fmt.Errorf("db.port is required")
	}

	if cfg.DB.Name == "" {
		return fmt.Errorf("db.name is required")
	}

	if cfg.DB.User == "" {
		return fmt.Errorf("db.user is required")
	}

	if cfg.Backend.Port == 0 {
		return fmt.Errorf("backend.port is required")
	}

	return nil
}

// Helper to get database connection string
func (c *Config) GetDBConnectionString() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		c.DB.Host,
		c.DB.Port,
		c.DB.User,
		c.DB.Password,
		c.DB.Name,
	)
}
