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

	// for i := range collectedData {
	// 	collectedData[i].LastUpdated = time.Now()
	// }

	m.dataMutex.Lock()
	m.currentData = collectedData
	m.dataMutex.Unlock()

	// Step 2: Evaluate each device and save
	successCount := 0
	// for _, customerData := range currentData {
	// 	// Evaluate
	// 	// result, err := m.evaluator.EvaluateHeatingData(customerData)
	// 	// if err != nil {
	// 	// 	log.Printf("ERROR: Evaluation failed for device %s: %v", data.DeviceID, err)
	// 	// 	continue
	// 	// }

	// 	// // Save to database
	// 	// if err := m.repository.SaveHeatingDataWithEvaluation(data, result); err != nil {
	// 	// 	log.Printf("ERROR: Failed to save data for device %s: %v", data.DeviceID, err)
	// 	// 	continue
	// 	// }

	// 	// successCount++

	// 	// // Log evaluation results
	// 	// m.logEvaluationResult(data, result)
	// }

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
