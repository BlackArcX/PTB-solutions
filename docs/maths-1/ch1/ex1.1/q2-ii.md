**Find $\frac{f(a+h)-f(a)}{h}$ and simplify, where** $$f(x)=\sin x$$

$$
\begin{steps}
   f(a+h) &= \sin(a+h)
\end{steps}
$$

$$
\begin{steps}
   f(a) &= \sin(a)
\end{steps}
$$

$$
\begin{steps}
   \frac{f(a+h)-f(a)}{h} &= \frac{\sin(a+h)-\sin(a)}{h}
   &= \frac{1}{h} \times 2\cos\left(\frac{a + h+a}{2}\right)\sin\left(\frac{a + h-a}{2}\right)
   % \text{As,} \sin(p)-\sin(q) = 2 \cos\left(\frac{p+q}{2}\right)\sin\left(\frac{p-q}{2}\right)
   &= \frac{2}{h} \cos\left(\frac{ 2a + h}{2}\right)\sin\left(\frac{h}{2}\right)
\end{steps}
$$