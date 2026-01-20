// service/evaluator.go
package service

import (
	"hm-backend/config"

	"gorm.io/gorm"
)

type HeatingEvaluator struct {
	configMgr *config.ConfigManager
	db        *gorm.DB
}

func NewHeatingEvaluator(configMgr *config.ConfigManager, db *gorm.DB) *HeatingEvaluator {
	return &HeatingEvaluator{
		configMgr: configMgr,
		db:        db,
	}
}

// EvaluateHeatingData performs comprehensive evaluation of heating data
func (e *HeatingEvaluator) EvaluateHeatingData(currentData CurrentData) error {
	// result := &model.EvaluationResult{
	// 	DeviceID:  current.DeviceID,
	// 	Timestamp: time.Now(),
	// 	Warnings:  []string{},
	// 	Anomalies: []string{},
	// }

	// // Basic status checks
	// result.Status = e.determineStatus(current)
	// result.Warnings = e.checkWarnings(current)

	// // Historical comparison (optional, only if we have historical data)
	// historical, err := e.repository.GetRecentData(current.DeviceID, 24*time.Hour)
	// if err != nil {
	// 	log.Printf("Warning: couldn't fetch historical data for %s: %v", current.DeviceID, err)
	// } else if len(historical) > 0 {
	// 	result.Anomalies = e.detectAnomalies(current, historical)
	// 	result.Score = e.calculateEfficiencyScore(current, historical)
	// } else {
	// 	result.Score = e.calculateBasicScore(current)
	// }

	// return result, nil
	return nil
}

// // determineStatus checks current operating status
// func (e *HeatingEvaluator) determineStatus(data *models.HeatingData) string {
// 	// Critical conditions
// 	if data.Temperature < 10 || data.Pressure < 0.5 {
// 		return "CRITICAL"
// 	}

// 	// Warning conditions
// 	if data.Temperature < 15 || data.Pressure < 1.0 || data.FlowTemperature > 80 {
// 		return "WARNING"
// 	}

// 	return "NORMAL"
// }

// // checkWarnings identifies specific issues
// func (e *HeatingEvaluator) checkWarnings(data *models.HeatingData) []string {
// 	var warnings []string

// 	if data.Pressure < 1.0 {
// 		warnings = append(warnings, "Low system pressure detected")
// 	}

// 	if data.FlowTemperature > 80 {
// 		warnings = append(warnings, "Flow temperature exceeds recommended limit")
// 	}

// 	if data.Temperature < 15 {
// 		warnings = append(warnings, "Room temperature below comfort level")
// 	}

// 	tempDiff := data.FlowTemperature - data.ReturnTemperature
// 	if tempDiff < 5 {
// 		warnings = append(warnings, "Low temperature differential - possible circulation issue")
// 	}

// 	return warnings
// }

// // detectAnomalies compares current with historical patterns
// func (e *HeatingEvaluator) detectAnomalies(current *models.HeatingData, historical []*models.HeatingData) []string {
// 	var anomalies []string

// 	avgTemp := e.calculateAverage(historical, func(d *models.HeatingData) float64 {
// 		return d.Temperature
// 	})

// 	if math.Abs(current.Temperature-avgTemp) > 10 {
// 		anomalies = append(anomalies, fmt.Sprintf(
// 			"Temperature anomaly: current %.1f°C vs 24h average %.1f°C",
// 			current.Temperature, avgTemp,
// 		))
// 	}

// 	avgPressure := e.calculateAverage(historical, func(d *models.HeatingData) float64 {
// 		return d.Pressure
// 	})

// 	if math.Abs(current.Pressure-avgPressure) > 0.3 {
// 		anomalies = append(anomalies, fmt.Sprintf(
// 			"Pressure anomaly: current %.2f bar vs average %.2f bar",
// 			current.Pressure, avgPressure,
// 		))
// 	}

// 	return anomalies
// }

// // calculateEfficiencyScore rates system efficiency 0-100
// func (e *HeatingEvaluator) calculateEfficiencyScore(current *models.HeatingData, historical []*models.HeatingData) float64 {
// 	score := 100.0

// 	// Penalize if temperature is outside comfort range
// 	if current.Temperature < 18 || current.Temperature > 22 {
// 		score -= 20
// 	}

// 	// Penalize low pressure
// 	if current.Pressure < 1.0 {
// 		score -= 15
// 	}

// 	// Penalize high power consumption vs historical average
// 	avgPower := e.calculateAverage(historical, func(d *models.HeatingData) float64 {
// 		return d.PowerConsumption
// 	})
// 	if current.PowerConsumption > avgPower*1.2 {
// 		score -= 10
// 	}

// 	if score < 0 {
// 		score = 0
// 	}

// 	return score
// }

// func (e *HeatingEvaluator) calculateBasicScore(current *models.HeatingData) float64 {
// 	score := 100.0

// 	if current.Temperature < 18 || current.Temperature > 22 {
// 		score -= 20
// 	}
// 	if current.Pressure < 1.0 {
// 		score -= 15
// 	}

// 	return math.Max(0, score)
// }

// func (e *HeatingEvaluator) calculateAverage(data []*models.HeatingData, getter func(*models.HeatingData) float64) float64 {
// 	if len(data) == 0 {
// 		return 0
// 	}

// 	sum := 0.0
// 	for _, d := range data {
// 		sum += getter(d)
// 	}
// 	return sum / float64(len(data))
// }
