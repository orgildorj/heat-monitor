// service/monitor.go
package service

import (
	"hm-backend/config"
	"log"
	"sync"

	"time"

	"gorm.io/gorm"
)

type HeatingMonitor struct {
	collector *HeatingDataCollector
	evaluator *HeatingEvaluator
	configMgr *config.ConfigManager

	currentData []HeatingDataResponse
	dataMutex   sync.RWMutex
}

type ParameterData struct {
	Label string
	Value float64
}

type HeatingDataResponse struct {
	CustomerId   int
	DeviceId     int
	CustomerName string
	Parameters   map[string]*ParameterData
	LastUpdated  time.Time
}

func NewHeatingMonitor(
	configMgr *config.ConfigManager,
	db *gorm.DB,
) *HeatingMonitor {
	return &HeatingMonitor{
		collector:   NewHeatingDataCollector(configMgr, db),
		evaluator:   NewHeatingEvaluator(configMgr, db),
		configMgr:   configMgr,
		currentData: make([]HeatingDataResponse, 0),
	}
}

func (m *HeatingMonitor) GetCurrentData() []HeatingDataResponse {
	m.dataMutex.RLock()
	defer m.dataMutex.RUnlock()

	dataCopy := make([]HeatingDataResponse, len(m.currentData))
	copy(dataCopy, m.currentData)

	return dataCopy
}

func (m *HeatingMonitor) GetCustomerData(customerID int) (*HeatingDataResponse, bool) {
	m.dataMutex.RLock()
	defer m.dataMutex.RUnlock()

	for _, data := range m.currentData {
		if data.CustomerId == customerID {
			return &data, true
		}
	}
	return nil, false
}

func (m *HeatingMonitor) Start() {
	log.Println("Heating monitor started")

	// Run immediately on start
	m.runMonitoringCycle()

	// Then run on interval
	ticker := time.NewTicker(m.getInterval())
	defer ticker.Stop()

	for range ticker.C {
		m.runMonitoringCycle()
	}
}

// runMonitoringCycle executes: collect → evaluate → save
func (m *HeatingMonitor) runMonitoringCycle() {
	log.Println("=== Starting monitoring cycle ===")
	startTime := time.Now()

	// Step 1: Collect data from all devices
	var err error
	collectedData, err := m.collector.FetchAllCustomerData()
	if err != nil {
		log.Printf("ERROR: Data collection failed: %v", err)
		return
	}

	log.Printf("Collected data from %d devices", len(collectedData))

	m.dataMutex.Lock()
	m.currentData = collectedData
	m.dataMutex.Unlock()

	successCount := 0

	cfg := m.configMgr.Get()

	for _, customerConfig := range cfg.Hreg.Customers {
		_, err := m.evaluator.Evaluate(customerConfig)
		if err != nil {
			log.Println("Error while evaluating device with id %v :%v", customerConfig.DeviceId, err)
			continue
		}

		successCount++
	}

	duration := time.Since(startTime)
	log.Printf("=== Monitoring cycle completed in %v (%d/%d devices successful) ===",
		duration, successCount, len(collectedData))
}

// func (m *HeatingMonitor) logEvaluationResult(data *models.HeatingData, result *models.EvaluationResult) {
// 	// log.Printf("Device %s - Status: %s, Score: %.1f, Temp: %.1f°C, Pressure: %.2f bar",
// 	// 	data.DeviceID, result.Status, result.Score, data.Temperature, data.Pressure)

// 	// if len(result.Warnings) > 0 {
// 	// 	log.Printf("  ⚠️  Warnings: %v", result.Warnings)
// 	// }

// 	// if len(result.Anomalies) > 0 {
// 	// 	log.Printf("  🔍 Anomalies: %v", result.Anomalies)
// 	// }
// }

func (m *HeatingMonitor) getInterval() time.Duration {
	cfg := m.configMgr.Get()
	return time.Duration(cfg.Hreg.CollectIntervalMin) * time.Minute
}
