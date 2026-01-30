package handler

import (
	"hm-backend/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllCurrentData(c *gin.Context, hm *service.HeatingMonitor) {
	data := hm.GetCurrentData()

	c.JSON(http.StatusOK, data)
}

func GetCustomerData(c *gin.Context, hm *service.HeatingMonitor) {
	customerId := c.Param("customer_id")

	intId, err := strconv.Atoi(customerId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "customerId not integer",
		})
		return
	}

	data, exists := hm.GetCustomerData(intId)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "customer not found",
		})
		return
	}

	c.JSON(http.StatusOK, data)
}
