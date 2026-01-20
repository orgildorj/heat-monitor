package util

import (
	"encoding/json"
	"fmt"
	"io"
	"net/smtp"
	"os"
)

var config_path = "./config.json"

type emailConfig struct {
	AdminEmail string `json:"admin_email"`
}

func loadEmailConfig() (string, error) {
	file, err := os.Open(config_path)
	if err != nil {
		return "", fmt.Errorf("cannot open config.json: %v", err)
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("cannot read config file: %v", err)
	}

	var result *emailConfig

	err = json.Unmarshal(bytes, &result)
	if err != nil {
		return "", fmt.Errorf("cannot parse config file: %v", err)
	}

	return result.AdminEmail, nil
}

func SendMail(betreff string, message string) error {
	// Config
	fromEmail := os.Getenv("GMAIL_ADRESS")
	fromName := "Heat Manager"
	app_password := os.Getenv("GMAIL_APP_PASSWORD")

	to, err := loadEmailConfig()
	if err != nil {
		return err
	}

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	auth := smtp.PlainAuth("", fromEmail, app_password, smtpHost)

	// Message
	toSend := fmt.Appendf(nil, "From: %v<%v>\r\nSubject: %v\n\n%v", fromName, fromEmail, betreff, message)

	// Send email
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, fromEmail, []string{to}, toSend)
	if err != nil {
		return err
	}

	return nil
}
