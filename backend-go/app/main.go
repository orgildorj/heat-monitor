package main

import (
	"hm-backend/config"
	"hm-backend/db"
	"hm-backend/handler"
	"hm-backend/service"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	configMgr *config.ConfigManager
)

func main() {
	log.SetFlags(log.LstdFlags)

	var err error
	configMgr, err = config.NewConfigManager("config.json")
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	db_instance, err := db.Init(configMgr)

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// collectorMgr := service.NewHeatingDataCollector(configMgr, db_instance)

	// go collectorMgr.FetchAllDevicesData()

	heatingMonitor := service.NewHeatingMonitor(configMgr, db_instance)

	go heatingMonitor.Start()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:81"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "received",
		})
	})

	api := r.Group("/api")
	{
		api.GET("/heating/current", func(c *gin.Context) {
			handler.GetAllCurrentData(c, heatingMonitor)
		})

		api.GET("/heating/current/:customer_id", func(c *gin.Context) {
			handler.GetCustomerData(c, heatingMonitor)
		})

		api.GET("/graph-data", func(c *gin.Context) {
			handler.GetGraphData(c, db_instance)
		})

		api.GET("/graph-data/stats", func(c *gin.Context) {
			handler.GetGraphDataStats(c, db_instance)
		})

		api.GET("/available-columns", func(c *gin.Context) {
			handler.GetAvailableColumns(c, db_instance)
		})
	}

	// r.GET("/test-email", func(c *gin.Context) {
	// 	err := util.SendMail("This is subject", "This is from Heat Manager.")
	// 	if err != nil {
	// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	// 		return
	// 	}
	// 	c.JSON(http.StatusAccepted, gin.H{})
	// })

	r.Run()
}
