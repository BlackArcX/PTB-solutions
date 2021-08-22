**Find the domain and range of the funtion $g$ and sketch graph of $g$**

$$
g(x) = \frac{x^2-16}{x-4}\quad, \quad x \ne 4
$$

```tikz
\begin{tikzpicture}[scale=0.50]
   \draw[<->,thick] (-8, 0) -- (9, 0) node[right] {$x$};
   \draw[<->,thick] (0, -4) -- (0, 12) node[above] {$y$};
   \draw[step=1,gray,very thin] (-7.9,-3.9) grid (8.9,11.9);
   \draw[domain=-7:3.9, smooth, variable=\x, thick, blue] plot ({\x}, {(\x+4)});
   \draw[domain=4.1:7, smooth, variable=\x, thick, blue] plot ({\x}, {(\x+4)});
\end{tikzpicture}
```