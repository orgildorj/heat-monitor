package model

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	UserId         int `gorm:"unique"`
	DeviceId       int `gorm:"unique"`
	LongName       string
	AdditionalInfo string
}

type HeatingData struct {
	gorm.Model

	CustomerId int       `gorm:"not null;uniqueIndex:idx_customer_col_time"`
	Customer   Customer  `gorm:"foreignKey:CustomerId;references:UserId"`
	ColName    string    `gorm:"not null;uniqueIndex:idx_customer_col_time"`
	Label      string    `gorm:"not null"`
	Value      float64   `gorm:"not null"`
	Time       time.Time `gorm:"not null;uniqueIndex:idx_customer_col_time"`
}

type Evaluation struct {
	gorm.Model

	CustomerId int      `gorm:"not null;unique"`
	Customer   Customer `gorm:"foreignKey:CustomerId;references:UserId"`
}

// type HeatingData struct {
// 	gorm.Model
// 	CustomerId     uint      `gorm:"not null"`
// 	Customer       Customer  `gorm:"foreignKey:CustomerId;references:ID"`
// 	PufferT1       float64   `gorm:"type:numeric(5,1)"`
// 	PufferT2       float64   `gorm:"type:numeric(5,1)"`
// 	PufferT3       float64   `gorm:"type:numeric(5,1)"`
// 	PufferT4       float64   `gorm:"type:numeric(5,1)"`
// 	EZ1Kessel      float64   `gorm:"type:numeric(5,1)"`
// 	EZ2Kessel      float64   `gorm:"type:numeric(5,1)"`
// 	HK1VorlaufSoll float64   `gorm:"type:numeric(5,1)"`
// 	HK2VorlaufSoll float64   `gorm:"type:numeric(5,1)"`
// 	Time           time.Time `gorm:"unique"`
// }

// type Log struct {
// 	gorm.Model
// 	Category string
// 	Message  string
// }

// type Notification struct {
// 	gorm.Model
// 	Message string `gorm:"not null"`
// 	IsRead  bool   `gorm:"default:false"`
// 	Type    string
// }
