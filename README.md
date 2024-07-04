# MarkMap for GPT
This is a [markmap] rendering service for ChatGPT and other AI agent tools . 

It can render markdown mindmap to svg / png and interactive html, just similar service as [PlantUML web server](https://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000),



## APIs
The service provides rendering in 3 formats: 
1. **interactive HTML**: https://mm.vercel.com/html/`{hash(map)}`
2. **svg**: https://mm.vercel.com/svg/`{hash(map)}`
3. **png**: https://mm.vercel.com/png/`{hash(map)}`

### Render API

* **GET** https://mm.vercel.com/render?
  * Parameter:
    * **content={content}** source of markdown text
    * **format={svg/html/png}**
    * **width={width}** width of rendered image, for png / jpg
    * **height={height}** height of rendered image for png / jpg
  * Response:
    * html: https://mm.vercel.com/{format}/`{hash(map)}`?width=xx&height=xx
    * png: https://mm.vercel.com/{format}/`{hash(map)}`?width=xx&height=xx


## Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

![sample.png](./public/sample.png)

  
* [Interactive fa HTML](public/sample.html)