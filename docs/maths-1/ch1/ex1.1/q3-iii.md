**Express the perimeter P of square as sfunction of its area.**

```tikz
\def\cubex{2}
\def\cubey{2}
\def\cubez{2}
\draw[thick,rounded corners=1pt] (0,0,0) -- ++(-\cubex,0,0) -- node[left]{$x$} ++(0,-\cubey,0) -- node[below]{$x$} ++(\cubex,0,0) -- cycle;
\draw[thick,rounded corners=1pt] (0,0,0) -- ++(0,0,-\cubez) -- ++(0,-\cubey,0) -- ++(0,0,\cubez) -- cycle;
\draw[thick,rounded corners=1pt] (0,0,0) -- ++(-\cubex,0,0) -- node[left]{$x$} ++(0,0,-\cubez) -- ++(\cubex,0,0) -- cycle;
```
