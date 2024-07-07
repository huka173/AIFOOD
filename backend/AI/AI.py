import torch
import torchvision.transforms as transforms
from PIL import Image
import sys
import os

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

class ImageClassifier:
    def __init__(self, labels_path, model_path):
        self.classes = self.create_classes(labels_path)
        self.model = self.load_model(model_path)
        self.preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(244),
            transforms.ToTensor(),
            transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
        ])

    def create_classes(self, file_path):
        with open(file_path, 'r') as file:
            words = file.read().split()
        word_dict = {index: word for index, word in enumerate(words, start=0)}
        return word_dict

    def load_model(self, model_path):
        loaded_model = torch.load(model_path)
        return loaded_model.to(device)

    def predict_image(self, image_path):
        self.model.eval()
        image = Image.open(image_path)
        input_tensor = self.preprocess(image)
        input_batch = input_tensor.unsqueeze(0).to(device)

        with torch.no_grad():
            output = self.model(input_batch)

        predicted_class_idx = output.argmax().item()
        predicted_class_name = self.classes[predicted_class_idx]
        return predicted_class_name

if __name__ == '__main__':
    image_path = sys.argv[1]
    labels_path = sys.argv[2]
    model_path = sys.argv[3]

    classifier = ImageClassifier(labels_path, model_path)
    predicted_class = classifier.predict_image(image_path)
    print(predicted_class)
