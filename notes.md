# Processes

## file-copy

```
locks: String[],
metadata: {
  from: String
  to: String
}
```

## file-delete

```
locks: String[],
metadata: {
  file: String
}
```

# Target

```
disks: {
  size: Number,
  name: String,
  files: {
    name: String
    size: Number,
    position: Number
  }
}
```