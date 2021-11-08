#include <iostream>
#include <math.h>

using namespace std;

int fn(m, n)
{
    if (m == = 1 || n == = 1)
    {
        return 1
    }
    if (m < n)
    {
        n = m
    }
    if (n == = 2)
    {
        return floor(m / 2) + 1
    }
}

int main()
{
    int t, m, n;
    while (t--)
    {
        cin >> m >> n;
        count << fn(m, n) << endl;
    }
}