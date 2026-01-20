package controller

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type authInput struct {
	password string
}

// func GetAuthMode(c *gin.Context) {
// 	var auth model.Auth
// 	res := db.DB.First(&auth)

// 	if res.Error != nil {
// 		log.Fatal("Database Auth reading failed.")
// 		c.JSON(http.StatusInternalServerError, gin.H{})
// 	}

// 	if auth.PasswordEncrypted == nil {
// 		c.JSON(http.StatusAccepted, gin.H{"mode": "signup"})
// 	} else {
// 		c.JSON(http.StatusAccepted, gin.H{"mode": "login"})
// 	}
// }

// func Signup(c *gin.Context) {
// 	var input authInput

// 	if err := c.BindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required and must be at least 8 characters"})
// 		return
// 	}

// 	var auth model.Auth
// 	db.DB.First(&auth)

// 	if auth.PasswordEncrypted != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Password already set"})
// 		return
// 	}

// 	strHash, err := generateHash(input.password)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Hashing failed"})
// 		return
// 	}

// 	auth.PasswordEncrypted = &strHash
// 	db.DB.Save(&auth)

// 	c.JSON(http.StatusCreated, gin.H{"message": "Password set successfully"})
// }

// func Login(c *gin.Context) {
// 	var input authInput

// 	if err := c.BindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required and must be at least 8 characters"})
// 		return
// 	}

// 	var auth model.Auth
// 	db.DB.First(&auth)

// 	if auth.PasswordEncrypted == nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "No password set. Please signup."})
// 		return
// 	}

// 	if err := bcrypt.CompareHashAndPassword([]byte(*auth.PasswordEncrypted), []byte(input.password)); err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
// 		return
// 	}

// 	tokenString, err := generateToken()
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":     "Login successful",
// 		"accessToken": tokenString,
// 		"expiration":  60 * 60,
// 	})
// }

func generateHash(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	strHash := string(hash)
	return strHash, err
}

func generateToken() (string, error) {
	claims := jwt.MapClaims{
		"exp": time.Now().Add(time.Minute * 60).Unix(),
		"iat": time.Now().Unix(),
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	println(jwtSecret)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	println("token:", token)
	return token.SignedString([]byte(jwtSecret))
}
