**Find the domain and range of the funtion $g$ and sketch graph of $g$**

$$
g(x) = \frac{x^2+3x+2}{x+1}\quad, \quad x \ne 1
$$

```tikz
\begin{tikzpicture}[scale=0.50]
   \draw[<->,thick] (-7, 0) -- (5, 0) node[right] {$x$};
   \draw[<->,thick] (0, -4) -- (0, 6) node[above] {$y$};
   \draw[step=1,gray,very thin] (-6.9,-3.9) grid (4.9,5.9);
   \draw[domain=-5:-1.1, smooth, variable=\x, thick, blue] plot ({\x}, {(\x+2)});
   \draw[domain=-0.9:3, smooth, variable=\x, thick, blue] plot ({\x}, {(\x+2)});
\end{tikzpicture}
```