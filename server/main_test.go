package main

import (
	"testing"
	"time"
)

func TestTimeFormat(t *testing.T) {
	tm := time.Now()

	format := "2006-01-02 15:04:05"
	formatted := tm.Format(format)
	actual := tm.String()

	parsedTime, _ := time.Parse(format, formatted)

	println("formatted: ", formatted)
	println("actual: ", actual)
	println("parsedTime: ", parsedTime.String())

}
