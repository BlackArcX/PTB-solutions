**Find the domain and range of the funtion $g$ and sketch graph of $g$**

$$
g(x) = \begin{cases}
   6x+7 &, x \le -2 \\
   x-3 &, x > -2
\end{cases}
$$

```tikz
\begin{tikzpicture}[scale=0.50]
   \draw[<->,thick] (-5, 0) -- (5, 0) node[right] {$x$};
   \draw[<->,thick] (0, -12) -- (0, 2) node[above] {$y$};
   \draw[step=1,gray,very thin] (-4.9,-11.9) grid (4.9,1.9);
   \draw[domain=-1:4, smooth, variable=\x, thick, blue] plot ({\x}, {\x-3});
   \draw[domain=-3:-2, smooth, variable=\x, thick, blue] plot ({\x}, {6*\x+7});
\end{tikzpicture}
```