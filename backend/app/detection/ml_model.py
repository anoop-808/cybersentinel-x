import math
import re
from collections import Counter

TRAINING = [
    ("benign", "svchost.exe system service started normal windows update"),
    ("benign", "explorer.exe user opened document file normal process"),
    ("benign", "chrome.exe browser connected to trusted website"),
    ("benign", "outlook.exe delivered normal email message"),
    ("benign", "windows defender scan completed successfully"),
    ("malicious", "powershell encodedcommand hidden execution"),
    ("malicious", "powershell invoke-webrequest download payload"),
    ("malicious", "powershell execution registry currentversion run persistence"),
    ("malicious", "word.exe powershell suspicious command download"),
    ("malicious", "powershell network connection external destination"),
]


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9_.\\:-]+", text.lower())


class BaselineNBClassifier:
    """Tiny pure-Python multinomial Naive Bayes baseline. Replace with a real model later."""

    def __init__(self) -> None:
        self.vocab = set()
        self.class_counts = Counter()
        self.token_counts = {"benign": Counter(), "malicious": Counter()}
        for label, text in TRAINING:
            self.class_counts[label] += 1
            tokens = tokenize(text)
            self.vocab.update(tokens)
            self.token_counts[label].update(tokens)
        self.total = sum(self.class_counts.values())

    def predict_risk(self, text: str) -> int:
        tokens = tokenize(text)
        if not tokens:
            return 5
        scores = {}
        vocab_size = max(len(self.vocab), 1)
        for label in ("benign", "malicious"):
            prior = self.class_counts[label] / self.total
            total_tokens = sum(self.token_counts[label].values()) + vocab_size
            log_prob = math.log(prior)
            for token in tokens:
                count = self.token_counts[label].get(token, 0) + 1
                log_prob += math.log(count / total_tokens)
            scores[label] = log_prob
        delta = scores["malicious"] - scores["benign"]
        probability = 1 / (1 + math.exp(-max(-20, min(20, delta))))
        return round(probability * 100)
