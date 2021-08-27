**Find the domain and range of the funtion $g$ and sketch graph of $g$**

$$
g(x) = 2x-5 
$$

$$ \text{Domain of } g(x) = \R $$ <br>
$$ \text{Range of } g(x) = \R $$

| $x$ | $g(x)=2x-5$ |
|:---:|:-----------:|
| $-3$| $-7$        |
| $-2$| $-9$        |
| $-1$| $-7$        |
| $0$ | $-5$        |
| $1$ | $-3$        |
| $2$ | $-1$        |
| $3$ | $1$         |

```tikz
\begin{tikzpicture}[scale=0.50]
    \draw[<->,thick] (-7, 0) -- (7, 0) node[right] {$x$};
    \draw[<->,thick] (0, -12) -- (0, 4) node[above] {$y$};
    \draw[step=1,gray,very thin] (-6.9,-11.9) grid (6.9,3.9);
    \draw[domain=-3.5:4.5, smooth, variable=\x, thick, blue] plot ({\x}, {2*\x-5});
\end{tikzpicture}
```