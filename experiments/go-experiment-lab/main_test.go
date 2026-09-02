package main

import "testing"

func TestGetPortUsesDefault(t *testing.T) {
	t.Setenv("PORT", "")

	port := getPort()

	if port != "5001" {
		t.Errorf("expected 5001, but got %s", port)
	}
}
func TestGetPortUsesEnvironmentalValue(t *testing.T) {
	t.Setenv("PORT", "7000")

	port := getPort()

	if port != "7000" {
		t.Errorf("expected 5001, but got %s", port)
	}
}