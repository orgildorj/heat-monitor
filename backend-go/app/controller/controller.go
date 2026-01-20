package controller

import (
	"hm-backend/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllCurrentData(c *gin.Context, hm *service.HeatingMonitor) {
	data := hm.GetCurrentData()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}

func GetCustomerData(c *gin.Context, hm *service.HeatingMonitor) {
	customerId := c.Param("customer_id")

	intId, err := strconv.Atoi(customerId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "customerId not integer",
		})
		return
	}

	data, exists := hm.GetCustomerData(intId)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "customer not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}
