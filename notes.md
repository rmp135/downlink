# Processes

All processes have a `locks: String[]` that prevents files with that ID from being deleted.

## file-copy

```
metadata: {
  from: String
  to: String
}
```

## file-delete

```
metadata: {
  file: String
}
```

# Target

```
storage: {
  size: Number,
  files: {
    name: String
    size: Number,
    position: Number,
    metadata: {
      contents: String
    }
  }
}
```

# Windows

All windows have a `locks: String[]` that prevents files with that ID from being deleted.

Windows are supplied with a windowData prop. If the window uses the mixin `window-data-mixin`, this data can be used to initialise a window with pre-populated data (such as a text file).