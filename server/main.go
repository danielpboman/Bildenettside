package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/h2non/filetype"
)

var filePath = os.Getenv("FILE_PATH")

func main() {
	r := gin.Default()

	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:8081", "http://192.168.2.153:8081"},
		AllowMethods: []string{"GET", "POST"},
	}))
	r.GET("/image", getImage())
	r.GET("/images", getImages())
	r.POST("/upload", saveFile())
	r.Use(func(c *gin.Context) {
		if c.Err() != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":   http.StatusInternalServerError,
				"status": c.Err().Error(),
			})
		}
	})

	r.Run(fmt.Sprintf("%s:%s", os.Getenv("HOST"), os.Getenv("PORT")))
}

func getImages() gin.HandlerFunc {
	return func(c *gin.Context) {
		images := make([]string, 0)

		files, err := ioutil.ReadDir(filePath)
		if err != nil {
			c.Error(err)
			return
		}
		for _, file := range files {
			images = append(images, file.Name())
		}
		c.JSON(http.StatusOK, images)
	}
}

func getImage() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("id")
		println(id)

		c.FileAttachment(fmt.Sprintf("%s/%s", filePath, id), id)

		c.Status(http.StatusOK)
	}
}

func writeFile(f io.ReadCloser, filePath string) error {
	defer f.Close()

	newFile, err := os.Create(filePath)
	if err != nil {
		return err
	}

	defer newFile.Close()

	if _, err := io.Copy(newFile, f); err != nil {
		return err
	}
	return nil
}

func saveFile() gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.Error(err)
			return
		}

		f, err := file.Open()

		header := make([]byte, 261)
		_, _ = f.Read(header)
		_, _ = f.Seek(0, 0)
		if !filetype.IsImage(header) {
			c.Error(fmt.Errorf("only images are accepted (PNG or JPG)"))
			return
		}

		t, _ := filetype.Match(header)

		filePath := fmt.Sprintf("%s/%s.%s", filePath, time.Now().Format("2006-01-02__15_04_05"), t.Extension)

		if err := writeFile(f, filePath); err != nil {
			c.Error(err)
		}
	}
}
