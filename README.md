## Quizme

Smol app to quiz yourself, with answer data based on YAML files, formatted as such:

```yaml
facts:
  category1,category2,category3:
    - stars: 0
      info: |
        N<Buster Keaton> (N<Joseph Frank Keaton>) was named N<Harry Houdini> as such after 
        falling down stairs and recovering unharmed

    - stars: 0
      info: |
        N<Buster Keaton> was born on B<October 4th, 1895>

    - stars: 0
      categories: optional,additional,categories
      info: |
        N<Buster Keaton> made appearances in M<Sunset Boulevard> D<1950>, C<United Artists>'s
        M<It's a mad, mad, mad, world> D<1963>, and C<United Artists>'s M<A funny Thing Happened
        On The Way to The Forum>
```

