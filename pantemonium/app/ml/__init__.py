from .computer_vision import PoseEstimator
from .recommender import CollaborativeFilter
from .nlp_reviews import ReviewMiner
from .classifier import ConfidenceClassifier
from .active_learning import FeedbackPipeline

# Global pseudo-singleton instantiations of our mocked pipelines
cv_model = PoseEstimator()
cf_recommender = CollaborativeFilter()
nlp_miner = ReviewMiner()
xgboost_classifier = ConfidenceClassifier()
active_feedback = FeedbackPipeline()
