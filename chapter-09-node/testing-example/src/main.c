int addTwoNumbers(int leftValue, int rightValue) {
  return leftValue + rightValue;
}

float divideTwoNumbers(float leftValue, float rightValue) {
  return leftValue / rightValue;
}

double findFactorial(float value) {
    int i;
    double factorial = 1;

    for (i = 1; i <= value; i++) {
        factorial = factorial * i;
    }
    return factorial;
}
