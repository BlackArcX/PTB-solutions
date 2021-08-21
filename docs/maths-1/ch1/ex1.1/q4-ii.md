**Find the domain and range of the funtion $g$ and sketch graph of $g$**

$$
g(x) = \sqrt{x^2-4}
$$

```tikz
\draw[<->,thick] (-5, 0) -- (5, 0) node[right] {$x$};
\draw[<->,thick] (0, -2) -- (0, 6) node[above] {$y$};
\draw[step=1,gray,very thin] (-4.9,-1.9) grid (4.9,5.9);
\draw[domain=-4:-2, samples=105, smooth, variable=\x, thick, blue] plot ({\x}, {sqrt(\x*\x-4)});
\draw[domain=2:4, smooth, variable=\x, thick, blue, samples=100] plot ({\x}, {sqrt(\x*\x-4)});
```