**Find the domain and range of the funtion $g$ and sketch graph of $g$**

$$
g(x) = \sqrt{x+1}
$$

```tikz
\draw[<->,thick] (-5, 0) -- (5, 0) node[right] {$x$};
\draw[<->,thick] (0, -2) -- (0, 6) node[above] {$y$};
\draw[step=1,gray,very thin] (-4.9,-1.9) grid (4.9,5.9);
\draw[domain=-1:4, samples=105, smooth, variable=\x, thick, blue] plot ({\x}, {sqrt(\x+1)});
```