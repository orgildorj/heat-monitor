package util

import (
	"bytes"
	"encoding/json"
	"net/http"
	"time"

	"golang.org/x/oauth2"
)

// --- Structs for API login/refresh ---
type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"` // seconds
}

type refreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

type refreshResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"`
}

// --- Custom TokenSource ---
type EmailPasswordTokenSource struct {
	Email      string
	Password   string
	LoginURL   string
	RefreshURL string

	token *oauth2.Token
}

func (ts *EmailPasswordTokenSource) Token() (*oauth2.Token, error) {
	// If no token yet or expired, fetch/refresh it
	if ts.token == nil || !ts.token.Valid() {
		var err error
		if ts.token == nil {
			ts.token, err = ts.login()
		} else {
			ts.token, err = ts.refresh()
		}
		if err != nil {
			return nil, err
		}
	}
	return ts.token, nil
}

// Login using email/password
func (ts *EmailPasswordTokenSource) login() (*oauth2.Token, error) {
	reqBody, _ := json.Marshal(loginRequest{Email: ts.Email, Password: ts.Password})
	resp, err := http.Post(ts.LoginURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result loginResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &oauth2.Token{
		AccessToken:  result.AccessToken,
		RefreshToken: result.RefreshToken,
		Expiry:       time.Now().Add(time.Duration(result.ExpiresIn) * time.Second),
	}, nil
}

// Refresh token
func (ts *EmailPasswordTokenSource) refresh() (*oauth2.Token, error) {
	reqBody, _ := json.Marshal(refreshRequest{RefreshToken: ts.token.RefreshToken})
	resp, err := http.Post(ts.RefreshURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result refreshResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	ts.token.AccessToken = result.AccessToken
	ts.token.RefreshToken = result.RefreshToken
	ts.token.Expiry = time.Now().Add(time.Duration(result.ExpiresIn) * time.Second)
	return ts.token, nil
}
