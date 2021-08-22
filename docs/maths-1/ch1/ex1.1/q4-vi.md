**Find the domain and range of the funtion $g$ and sketch graph of $g$**

$$
g(x) = \begin{cases}
   x-1 &, x < 3 \\
   2x+1 &, x \ge 3
\end{cases}
$$

```tikz
\begin{tikzpicture}[scale=0.50]
   \draw[<->,thick] (-7, 0) -- (7, 0) node[right] {$x$};
   \draw[<->,thick] (0, -4) -- (0, 14) node[above] {$y$};
   \draw[step=1,gray,very thin] (-6.9,-3.9) grid (6.9,13.9);
   \draw[domain=-2:2, smooth, variable=\x, thick, blue] plot ({\x}, {\x-1});
   \draw[domain=3:6, smooth, variable=\x, thick, blue] plot ({\x}, {2*\x+1});
\end{tikzpicture}
```