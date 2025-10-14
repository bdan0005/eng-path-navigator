import numpy as np

class LogisticRegression:
    def __init__(self, lr=0.1, max_epochs=10000, tol=1e-6, verbose=True):
        self.lr = lr
        self.max_epochs = max_epochs
        self.tol = tol
        self.verbose = verbose

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    def fit(self, X, y):
        self.n_classes = len(np.unique(y))
        self.n_features = X.shape[1]
        self.W = np.zeros((self.n_features, self.n_classes))
        self.b = np.zeros(self.n_classes)

        y = np.array(y)
        prev_loss = np.inf

        for epoch in range(self.max_epochs):
            # Forward pass
            logits = X.dot(self.W) + self.b
            probs = self.softmax(logits)

            # Compute gradient
            N = X.shape[0]
            dscores = probs
            dscores[range(N), y] -= 1
            dscores /= N

            dW = X.T.dot(dscores)
            db = np.sum(dscores, axis=0)

            # Update weights
            self.W -= self.lr * dW
            self.b -= self.lr * db

            # Compute loss
            loss = -np.mean(np.log(probs[range(N), y]))

            # Check convergence
            if np.abs(prev_loss - loss) < self.tol:
                if self.verbose:
                    print(f"Converged at epoch {epoch}, Loss: {loss:.6f}")
                break

            prev_loss = loss

            if self.verbose and epoch % 100 == 0:
                print(f"Epoch {epoch}, Loss: {loss:.6f}")

    def predict_proba(self, X):
        logits = X.dot(self.W) + self.b
        return self.softmax(logits)

    def predict(self, X):
        probs = self.predict_proba(X)
        return np.argmax(probs, axis=1)
