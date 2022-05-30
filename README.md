# MarkMeta

[![NPM version](https://img.shields.io/npm/v/mark-meta?color=a1b858&label=)](https://www.npmjs.com/package/mark-meta)


Add meta info to your markdown file.

## Usage

cd to any directory path and run

```bash
npx mark-meta
```

It will scan all your files under the current directory and find all markdown files (.md). Then it will create a config file named `meta.json` at the first running time, the default config is:

```json
{
  "title": ""
}
```

All the founded markdown file will add a meta info according to the above `meta.json`. Like:

``` md
---
title: ''
---

<--your content-->
# h1
## h2
```

You can edit `meta.json` to customize your own meta info.

If meta info already exists in a markdown file, this will not be modified by default. If you want to replace them, you can add `--replace` or `-r` argument. Like:

```bash
npx mark-meta --replace
```

## CLI Options

| Options | Alias | Description |
| --- | --- | --- |
| `--replace` | `-r` | Replace the existed meta info.