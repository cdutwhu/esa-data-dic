package preproc

import (
	"bytes"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	gio "github.com/digisan/gotk/io"
	"github.com/digisan/gotk/strs"
	jt "github.com/digisan/json-tool"
	lk "github.com/digisan/logkit"
)

// 1) Escape quotation marks used around HTML attributes like so <img src=\"someimage.png\" />

// 2) Escape the forward slash in HTML end tags. <div>Hello
//    World!<\/div>. This is an ancient artifact of an old HTML spec that didn't want HTML parsers to get confused when putting strings in a <SCRIPT> tag. For some reason, today’s browsers still like it.

// 3) This one was totally bizarre. You should include a space between the tag name and the slash on self-closing tags. I have no idea why this is, but on MOST modern browsers, if you try using javascript to append a <li> tag as a child of an unordered list that is formatted like so: <ul/>, it won't work. It gets added to the DOM after the ul tag. But, if the code looks like this: <ul /> (notice the space before the /), everything works fine. Very strange indeed.

// 4) Be sure to encode any quotation marks that might be included in (bad) HTML content. This is the only thing that would really break the JSON by accidentally terminating the string early. Any " characters should be encoded as &quot; if it is meant to be included as HTML content.

func rmLF(data []byte) []byte {
	data = bytes.ReplaceAll(data, []byte{'\n'}, []byte{})
	data = bytes.ReplaceAll(data, []byte{'\r'}, []byte{})
	return data
}

func escQuInHTML(ori string) string {
	r := regexp.MustCompile(`<[\w\d]+\s[^>]+>`)
	return r.ReplaceAllStringFunc(ori, func(s string) string {
		fmt.Println("---", s)
		s = strings.ReplaceAll(s, `"`, `\"`)
		s = strings.ReplaceAll(s, `\\`, `\`)
		return s
	})
}

func fixErrComma(s string) string {
	r := regexp.MustCompile(`,\s*[\}\]]`)
	spanList := r.FindAllStringIndex(s, -1)
	for _, span := range spanList {
		b, e := span[0], span[1]
		fmt.Println(s[b:e])
	}
	spanls := [][2]int{}
	for _, span := range spanList {
		spanls = append(spanls, [2]int{span[0], span[1] - 1})
	}
	return strs.RangeReplace(s, spanls, []string{" "})
}

func Preproc() {
	filepath.Walk("../", func(path string, info fs.FileInfo, err error) error {
		if strings.HasSuffix(path, ".json") {

			fmt.Println(path)
			data, err := os.ReadFile(path)
			if err != nil {
				return err
			}

			data = rmLF(data)
			data = []byte(escQuInHTML(string(data)))
			data = []byte(fixErrComma(string(data)))

			if !jt.IsValid(data) {
				gio.MustCreateDir("err/")
				outname := filepath.Base(path)
				out := filepath.Join("err/", outname)
				os.WriteFile(out, data, os.ModePerm)
				lk.FailOnErr("%v", fmt.Errorf("json error@ %s", path))
			}

			// save
			gio.MustCreateDir("out/")
			outname := filepath.Base(path)
			out := filepath.Join("out/", outname)
			os.WriteFile(out, data, os.ModePerm)

			lk.Log("%s is processed & stored", out)
		}
		return nil
	})
}
