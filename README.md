# 大乐透玄学研究所

## 启动

```bash
npm install
npm run dev
```

## 更新开奖数据

平时只需要执行一条：

```bash
npm run sync:dlt
```

这个命令会读取中国体彩网官方历史接口，并从本地最新期开始自动补齐缺失数据。

如果很久没更新，断档较多：

```bash
npm run sync:dlt -- --limit=200
```

`limit` 表示向官方拉最近多少期。断档越久，可以把数值调大。

更新后建议检查一次：

```bash
npm run data:validate
```

## 其他数据命令

- `npm run data:import-md`：从 `dlt_history_FULL.md` 重新生成 JSON，平时不需要。
- `npm run data:export-md`：从 JSON 导出 Markdown，平时不需要。
- `npm test`：运行测试。
- `npm run build`：生产构建。
