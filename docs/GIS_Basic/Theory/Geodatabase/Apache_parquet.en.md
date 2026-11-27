# 📦 Apache Parquet — a columnar data format

**Apache Parquet** is an open, columnar data format optimized for storing and transferring large-scale analytical data efficiently.

---

## 🔍 Why Parquet?

- **Columnar storage** – data is stored by column rather than by row, which speeds up analytical queries.
- **High compression** – data compresses better because one column holds data of the same type.
- **Multi-language support** – it can be used with Python (pandas, pyarrow), R, Java, Spark and other technologies.
- **Fits the Hadoop ecosystem** – compatible with Hive, Impala, Drill, Spark and others.

---

## 🧱 Structure

A Parquet file is made of:

- **Row groups** – chunks of data that contain rows.
- **Column chunks** – the data of each column inside a row group.
- **Pages** – a column chunk is divided into pages. Each page contains data or metadata.

---

## 📈 Advantages

| Advantage | Description |
|-------------|--------|
| 🚀 Fast reading | Especially efficient when only some columns are needed |
| 💾 Space savings | Compresses well and reduces storage load |
| 🔁 Scalability | Easily adapts to large data streams |
| 🔌 Ecosystem integration | Works well with Spark, Hadoop, Hive, Presto and others |

---

## 🧪 How to use it in Python?

```python
import pandas as pd

# convert a CSV to Parquet
df = pd.read_csv("data.csv")
df.to_parquet("data.parquet")

# read a Parquet file
df_parquet = pd.read_parquet("data.parquet")
```

> 💡 Note: the `pyarrow` or `fastparquet` library is needed.

---

## 🆚 Parquet vs CSV

| Characteristic     | Parquet     | CSV         |
|-------------------|-------------|-------------|
| Storage type      | Columnar     | Row-based      |
| File size       | Small        | Large         |
| Read speed | High       | Low       |
| Metadata     | Yes           | No          |

---

## 🌐 Areas of use

- data analytics and BI
- storing large volumes of data (data lakes)
- ETL processes
- preprocessing data for machine learning

---

## 📚 Resources

- [Apache Parquet official website](https://parquet.apache.org/)
- [Parquet and PyArrow documentation](https://arrow.apache.org/docs/python/parquet.html)

---

## ✅ Summary

Apache Parquet is a modern, efficient and fast file format for analysing large volumes of data. It is especially useful when only some columns need to be read or when data must be stored compactly.

---
