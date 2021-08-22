**Find the domain and range of the funtion $g$ and sketch graph of $g$**

$$
g(x) = \left|x-3\right|
$$

```tikz
\begin{tikzpicture}[scale=0.50]
    \draw[<->,thick] (-5, 0) -- (6, 0) node[right] {$x$};
    \draw[<->,thick] (0, -2) -- (0, 7) node[above] {$y$};
    \draw[step=1,gray,very thin] (-4.9,-1.9) grid (5.9,6.9);
    \draw[domain=-3:5, samples=105, smooth, variable=\x, thick, blue] plot ({\x}, {abs(\x-3)});
\end{tikzpicture}
```