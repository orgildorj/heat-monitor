package handler

import (
	"hm-backend/model"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Request structure
type GraphDataRequest struct {
	CustomerId int    `form:"customer_id" binding:"required"`
	ColNames   string `form:"col_names" binding:"required"`
	StartDate  string `form:"start_date" binding:"required"`
	EndDate    string `form:"end_date" binding:"required"`
}

func (r *GraphDataRequest) GetColNamesArray() []string {
	return strings.Split(r.ColNames, ",")
}

// Response structures
type DataPoint struct {
	Time   time.Time          `json:"time"`
	Values map[string]float64 `json:"values"`
	Labels map[string]string  `json:"labels"`
}

type GraphDataResponse struct {
	CustomerId   int         `json:"customer_id"`
	CustomerName string      `json:"customer_name"`
	StartTime    time.Time   `json:"start_time"`
	EndTime      time.Time   `json:"end_time"`
	Data         []DataPoint `json:"data"`
}

type Stats struct {
	ColName string  `json:"col_name"`
	Label   string  `json:"label"`
	Avg     float64 `json:"avg"`
	Min     float64 `json:"min"`
	Max     float64 `json:"max"`
	Current float64 `json:"current"`
}

type AvailableColumn struct {
	ColName string `json:"col_name"`
	Label   string `json:"label"`
}

// GetAvailableColumns returns all unique columns for a customer
// GET /api/available-columns?customer_id=123
func GetAvailableColumns(c *gin.Context, db *gorm.DB) {
	customerIdStr := c.Query("customer_id")
	if customerIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer_id is required"})
		return
	}

	customerId, err := strconv.Atoi(customerIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid customer_id"})
		return
	}

	var columns []AvailableColumn
	if err := db.Model(&model.HeatingData{}).
		Select("DISTINCT col_name, label").
		Where("customer_id = ?", customerId).
		Order("col_name ASC").
		Scan(&columns).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch columns"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"customer_id": customerId,
		"columns":     columns,
	})
}

// GetGraphData returns heating data for a specific customer
// GET /api/graph-data?customer_id=123&col_names=puffer_t1,puffer_t2&start_date=...&end_date=...
func GetGraphData(c *gin.Context, db *gorm.DB) {
	var req GraphDataRequest

	// Bind query parameters
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse dates
	startTime, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date format, use ISO 8601"})
		return
	}

	endTime, err := time.Parse(time.RFC3339, req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date format, use ISO 8601"})
		return
	}

	// Fetch customer info
	var customer model.Customer
	if err := db.Where("user_id = ?", req.CustomerId).First(&customer).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Fetch heating data
	var heatingData []model.HeatingData
	if err := db.Where("customer_id = ? AND col_name IN ? AND time BETWEEN ? AND ?",
		req.CustomerId,
		req.GetColNamesArray(),
		startTime,
		endTime,
	).Order("time ASC").Find(&heatingData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}

	// Group data by time
	dataPoints := groupDataByTime(heatingData)

	response := GraphDataResponse{
		CustomerId:   req.CustomerId,
		CustomerName: customer.LongName,
		StartTime:    startTime,
		EndTime:      endTime,
		Data:         dataPoints,
	}

	c.JSON(http.StatusOK, response)
}

// GetGraphDataStats returns statistics for the requested data
// GET /api/graph-data/stats?customer_id=123&col_names=puffer_t1,puffer_t2&start_date=...&end_date=...
func GetGraphDataStats(c *gin.Context, db *gorm.DB) {
	var req GraphDataRequest

	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse dates
	startTime, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date format, use ISO 8601"})
		return
	}

	endTime, err := time.Parse(time.RFC3339, req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date format, use ISO 8601"})
		return
	}

	var stats []Stats

	for _, colName := range req.GetColNamesArray() {
		var result struct {
			Avg float64
			Min float64
			Max float64
		}

		// Get avg, min, max
		db.Model(&model.HeatingData{}).
			Select("AVG(value) as avg, MIN(value) as min, MAX(value) as max").
			Where("customer_id = ? AND col_name = ? AND time BETWEEN ? AND ?",
				req.CustomerId, colName, startTime, endTime).
			Scan(&result)

		// Get most recent value and label
		var latest model.HeatingData
		db.Where("customer_id = ? AND col_name = ?", req.CustomerId, colName).
			Order("time DESC").
			First(&latest)

		stats = append(stats, Stats{
			ColName: colName,
			Label:   latest.Label,
			Avg:     result.Avg,
			Min:     result.Min,
			Max:     result.Max,
			Current: latest.Value,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"customer_id": req.CustomerId,
		"start_date":  req.StartDate,
		"end_date":    req.EndDate,
		"stats":       stats,
	})
}

// Helper functions

func calculateTimeRange(timeRange string) (time.Time, time.Time) {
	endTime := time.Now()
	var startTime time.Time

	switch timeRange {
	case "today":
		startTime = time.Date(endTime.Year(), endTime.Month(), endTime.Day(), 0, 0, 0, 0, endTime.Location())
	case "yesterday":
		yesterday := endTime.AddDate(0, 0, -1)
		startTime = time.Date(yesterday.Year(), yesterday.Month(), yesterday.Day(), 0, 0, 0, 0, endTime.Location())
		endTime = time.Date(yesterday.Year(), yesterday.Month(), yesterday.Day(), 23, 59, 59, 0, endTime.Location())
	case "7d":
		startTime = endTime.AddDate(0, 0, -7)
	case "14d":
		startTime = endTime.AddDate(0, 0, -14)
	case "30d":
		startTime = endTime.AddDate(0, 0, -30)
	case "90d":
		startTime = endTime.AddDate(0, 0, -90)
	case "thisWeek":
		// Start of current week (Monday)
		weekday := int(endTime.Weekday())
		if weekday == 0 {
			weekday = 7 // Sunday
		}
		startTime = endTime.AddDate(0, 0, -(weekday - 1))
		startTime = time.Date(startTime.Year(), startTime.Month(), startTime.Day(), 0, 0, 0, 0, startTime.Location())
	case "lastWeek":
		// Start of last week (Monday)
		weekday := int(endTime.Weekday())
		if weekday == 0 {
			weekday = 7
		}
		startTime = endTime.AddDate(0, 0, -(weekday + 6))
		startTime = time.Date(startTime.Year(), startTime.Month(), startTime.Day(), 0, 0, 0, 0, startTime.Location())
		endTime = startTime.AddDate(0, 0, 6)
		endTime = time.Date(endTime.Year(), endTime.Month(), endTime.Day(), 23, 59, 59, 0, endTime.Location())
	case "thisMonth":
		startTime = time.Date(endTime.Year(), endTime.Month(), 1, 0, 0, 0, 0, endTime.Location())
	case "lastMonth":
		firstOfThisMonth := time.Date(endTime.Year(), endTime.Month(), 1, 0, 0, 0, 0, endTime.Location())
		startTime = firstOfThisMonth.AddDate(0, -1, 0)
		endTime = firstOfThisMonth.Add(-time.Second)
	default:
		// Default to last 7 days
		startTime = endTime.AddDate(0, 0, -7)
	}

	return startTime, endTime
}

func groupDataByTime(heatingData []model.HeatingData) []DataPoint {
	dataMap := make(map[time.Time]map[string]model.HeatingData)

	for _, data := range heatingData {
		if _, exists := dataMap[data.Time]; !exists {
			dataMap[data.Time] = make(map[string]model.HeatingData)
		}
		dataMap[data.Time][data.ColName] = data
	}

	var dataPoints []DataPoint
	for timestamp, colData := range dataMap {
		values := make(map[string]float64)
		labels := make(map[string]string)

		for colName, data := range colData {
			values[colName] = data.Value
			labels[colName] = data.Label
		}

		dataPoints = append(dataPoints, DataPoint{
			Time:   timestamp,
			Values: values,
			Labels: labels,
		})
	}

	return dataPoints
}
