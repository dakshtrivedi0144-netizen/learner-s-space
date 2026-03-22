angular.module('learningPortalApp')
.controller('DMLabCtrl', ['$scope', function($scope) {

  var STORAGE_KEY = 'ulp_dm_practicals';
  function loadSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch(e) { return {}; }
  }
  function save() {
    var data = {};
    $scope.practicals.forEach(function(p) { data[p.id] = { completed: p.completed, notes: p.notes }; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  var practicalData = [
    { title: 'Compare DM & DW Tools',
      aim: 'Identify and compare features of popular Data Mining and Data Warehousing tools.',
      code: '// DM Tools: WEKA, RapidMiner, Orange, R (caret), Python (scikit-learn)\n// DW Tools: Amazon Redshift, Google BigQuery, Snowflake, Azure Synapse, Apache Hive\n// WEKA: open source, Java, GUI, algorithms: J48, NaiveBayes, K-Means\n// RapidMiner: drag-drop workflow, 1500+ operators, free community edition\n// Redshift: cloud DW, columnar storage, petabyte scale\n// BigQuery: serverless, pay-per-query, ML built-in\n// Snowflake: multi-cloud, auto-scaling, data sharing' },
    { title: 'Data Cube - Snowflake Schema (Airport)',
      aim: 'Design and create a data cube using a snowflake schema for an Airport Authority dataset.',
      code: '-- Snowflake Schema: normalized dimension tables\nCREATE TABLE Flight_Fact (\n  flight_id INT, date_id INT, airport_id INT,\n  airline_id INT, passengers INT, revenue DECIMAL(10,2)\n);\nCREATE TABLE Date_Dim (date_id INT, date DATE, month_id INT);\nCREATE TABLE Month_Dim (month_id INT, month_name VARCHAR(20), quarter INT, year INT);\nCREATE TABLE Airport_Dim (airport_id INT, airport_code VARCHAR(5), city_id INT);\nCREATE TABLE City_Dim (city_id INT, city_name VARCHAR(50), state VARCHAR(50));\nCREATE TABLE Airline_Dim (airline_id INT, airline_name VARCHAR(100));\n-- Query: Revenue by airline and quarter\nSELECT a.airline_name, m.quarter, SUM(f.revenue) as total_revenue\nFROM Flight_Fact f JOIN Airline_Dim a ON f.airline_id=a.airline_id\nJOIN Date_Dim d ON f.date_id=d.date_id JOIN Month_Dim m ON d.month_id=m.month_id\nGROUP BY a.airline_name, m.quarter ORDER BY m.quarter;' },
    { title: 'Data Cube - Fact Constellation (Cricket)',
      aim: 'Design and create a data cube using a Fact constellation schema for a Cricket Team dataset.',
      code: '-- Fact Constellation: two fact tables sharing dimensions\nCREATE TABLE Player_Dim (player_id INT, player_name VARCHAR(100), country VARCHAR(50));\nCREATE TABLE Match_Dim (match_id INT, match_date DATE, venue VARCHAR(100), match_type VARCHAR(20));\nCREATE TABLE Team_Dim (team_id INT, team_name VARCHAR(100));\n-- Fact Table 1: Batting\nCREATE TABLE Batting_Fact (\n  player_id INT, match_id INT, team_id INT,\n  runs_scored INT, balls_faced INT, strike_rate DECIMAL(5,2)\n);\n-- Fact Table 2: Bowling\nCREATE TABLE Bowling_Fact (\n  player_id INT, match_id INT, team_id INT,\n  wickets INT, runs_given INT, economy DECIMAL(4,2)\n);\n-- Query: Top scorers by match type\nSELECT p.player_name, m.match_type, SUM(b.runs_scored) as total_runs\nFROM Batting_Fact b JOIN Player_Dim p ON b.player_id=p.player_id\nJOIN Match_Dim m ON b.match_id=m.match_id\nGROUP BY p.player_name, m.match_type ORDER BY total_runs DESC LIMIT 10;' },
    { title: 'OLAP Operations - Courier Company',
      aim: 'Perform OLAP operations: slice, dice, roll-up, drill-down on a courier company cube.',
      code: '-- Courier Fact Table\nCREATE TABLE Courier_Fact (\n  date DATE, region VARCHAR(50), service_type VARCHAR(30),\n  deliveries INT, revenue DECIMAL(10,2)\n);\n-- SLICE: Fix service_type = Express\nSELECT date, region, deliveries FROM Courier_Fact WHERE service_type = "Express";\n-- DICE: Multiple dimension ranges\nSELECT * FROM Courier_Fact\nWHERE region IN ("North","South") AND date BETWEEN "2024-01-01" AND "2024-03-31";\n-- ROLL-UP: Daily to Yearly\nSELECT YEAR(date) as year, SUM(deliveries) as total\nFROM Courier_Fact GROUP BY YEAR(date);\n-- DRILL-DOWN: Year to Month\nSELECT YEAR(date) yr, MONTH(date) mo, SUM(revenue) rev\nFROM Courier_Fact WHERE YEAR(date)=2024 GROUP BY yr, mo ORDER BY mo;' },
    { title: 'Attribute Relevance - Weather Data',
      aim: 'Analyze attribute relevance using a weather data warehouse.',
      code: '# Attribute Relevance using Mutual Information\nimport pandas as pd\nimport numpy as np\nfrom sklearn.feature_selection import mutual_info_classif\nfrom sklearn.preprocessing import LabelEncoder\n\ndata = {\n  "outlook":["sunny","sunny","overcast","rainy","rainy","rainy","overcast","sunny","sunny","rainy","sunny","overcast","overcast","rainy"],\n  "temperature":["hot","hot","hot","mild","cool","cool","cool","mild","cool","mild","mild","mild","hot","mild"],\n  "humidity":["high","high","high","high","normal","normal","normal","high","normal","normal","normal","high","normal","high"],\n  "wind":["weak","strong","weak","weak","weak","strong","strong","weak","weak","weak","strong","strong","weak","strong"],\n  "play":["no","no","yes","yes","yes","no","yes","no","yes","yes","yes","yes","yes","no"]\n}\ndf = pd.DataFrame(data)\nle = LabelEncoder()\nfor col in df.columns: df[col] = le.fit_transform(df[col])\nX = df.drop("play", axis=1); y = df["play"]\nscores = mutual_info_classif(X, y, random_state=42)\nfor f, s in zip(X.columns, scores): print(f"{f}: {s:.4f}")' }
  ];


  var p6 = { title: 'Hadoop Framework for Distributed Processing',
    aim: 'Demonstrate the use of Hadoop Framework for distributed data processing.',
    code: '# Hadoop MapReduce Word Count\n# mapper.py\nimport sys\nfor line in sys.stdin:\n    for word in line.strip().split():\n        print(f"{word}\\t1")\n\n# reducer.py\nimport sys\nfrom collections import defaultdict\nwc = defaultdict(int)\nfor line in sys.stdin:\n    w, c = line.strip().split("\\t")\n    wc[w] += int(c)\nfor w, c in sorted(wc.items()): print(f"{w}\\t{c}")\n\n# Run on Hadoop:\n# hadoop jar hadoop-streaming.jar -input /input/data.txt -output /output/wc -mapper mapper.py -reducer reducer.py\n# HDFS: hdfs dfs -mkdir /input && hdfs dfs -put data.txt /input/' };

  var p7 = { title: 'Social Media Data Mining',
    aim: 'Explore and analyze patterns from social media data using social data mining techniques.',
    code: '# Social Media Pattern Analysis\nimport pandas as pd, re\nfrom collections import Counter\nposts = [\n  {"text":"Love iPhone! #Apple #Tech","likes":150},\n  {"text":"Python for data science #Python #ML","likes":200},\n  {"text":"Cloud is future #AWS #Cloud #Tech","likes":180},\n  {"text":"Data mining finds patterns #DataMining #ML","likes":220}\n]\ndf = pd.DataFrame(posts)\nall_tags = [t for text in df.text for t in re.findall(r"#\\w+", text)]\nprint("Top Hashtags:", Counter(all_tags).most_common(5))\nprint("Avg Likes:", df.likes.mean())\nprint("Most Liked:", df.loc[df.likes.idxmax(), "text"])' };

  var p8 = { title: 'Naïve Bayes Classification',
    aim: 'Implement Naïve Bayes algorithm to generate classification rules.',
    code: '# Naïve Bayes on Play Tennis Dataset\nfrom sklearn.naive_bayes import CategoricalNB\nfrom sklearn.preprocessing import LabelEncoder\nimport numpy as np\n\nX_raw = [["sunny","hot","high","weak"],["sunny","hot","high","strong"],\n  ["overcast","hot","high","weak"],["rainy","mild","high","weak"],\n  ["rainy","cool","normal","weak"],["rainy","cool","normal","strong"],\n  ["overcast","cool","normal","strong"],["sunny","mild","high","weak"],\n  ["sunny","cool","normal","weak"],["rainy","mild","normal","weak"],\n  ["sunny","mild","normal","strong"],["overcast","mild","high","strong"],\n  ["overcast","hot","normal","weak"],["rainy","mild","high","strong"]]\ny_raw = ["no","no","yes","yes","yes","no","yes","no","yes","yes","yes","yes","yes","no"]\nles = [LabelEncoder() for _ in range(4)]\nX = np.array([[les[i].fit_transform([r[i] for r in X_raw])[j] for i in range(4)] for j in range(len(X_raw))])\ny = LabelEncoder().fit_transform(y_raw)\nmodel = CategoricalNB(); model.fit(X, y)\nprint("Accuracy:", (model.predict(X) == y).mean())' };

  var p9 = { title: 'Data Preprocessing Techniques',
    aim: 'Apply preprocessing: handling missing values, sampling, and binning.',
    code: '# Data Preprocessing\nimport pandas as pd, numpy as np\nfrom sklearn.preprocessing import MinMaxScaler\nnp.random.seed(42)\ndf = pd.DataFrame({"age":[25,np.nan,35,45,np.nan,28,52,33,np.nan,41],\n  "income":[30000,45000,np.nan,80000,25000,np.nan,95000,42000,38000,70000]})\nprint("Missing values:\\n", df.isnull().sum())\ndf["age"].fillna(df["age"].median(), inplace=True)\ndf["income"].fillna(df["income"].mean(), inplace=True)\nprint("After fill:\\n", df)\n# Binning\ndf["age_group"] = pd.cut(df["age"], bins=[0,30,40,60], labels=["Young","Middle","Senior"])\nprint("Binned:\\n", df[["age","age_group"]])\n# Normalize\ndf["income_norm"] = MinMaxScaler().fit_transform(df[["income"]])\nprint("Normalized:\\n", df[["income","income_norm"]])' };

  var p10 = { title: 'Apriori Algorithm',
    aim: 'Implement the Apriori algorithm to discover frequent itemsets and generate association rules.',
    code: '# Apriori Algorithm\n# pip install mlxtend\nfrom mlxtend.frequent_patterns import apriori, association_rules\nfrom mlxtend.preprocessing import TransactionEncoder\nimport pandas as pd\ntransactions = [\n  ["bread","milk","butter"],["bread","diapers","beer","eggs"],\n  ["milk","diapers","beer","cola"],["bread","milk","diapers","beer"],\n  ["bread","milk","diapers","cola"],["milk","butter"],\n  ["bread","butter","eggs"],["bread","milk","diapers"]\n]\nte = TransactionEncoder()\ndf = pd.DataFrame(te.fit_transform(transactions), columns=te.columns_)\nfreq = apriori(df, min_support=0.375, use_colnames=True)\nprint("Frequent Itemsets:\\n", freq)\nrules = association_rules(freq, metric="confidence", min_threshold=0.6)\nprint("\\nRules:\\n", rules[["antecedents","consequents","support","confidence","lift"]])' };

  var p11 = { title: 'K-Means and K-Medoids Clustering',
    aim: 'Perform clustering using K-Means and K-Medoids.',
    code: '# K-Means Clustering\n# pip install scikit-learn-extra\nfrom sklearn.cluster import KMeans\nfrom sklearn_extra.cluster import KMedoids\nfrom sklearn.datasets import make_blobs\nX, _ = make_blobs(n_samples=150, centers=3, cluster_std=0.8, random_state=42)\nkm = KMeans(n_clusters=3, random_state=42, n_init=10)\nkm.fit(X)\nprint("K-Means Inertia:", km.inertia_)\nprint("Centers:\\n", km.cluster_centers_)\nkmed = KMedoids(n_clusters=3, random_state=42)\nkmed.fit(X)\nprint("\\nK-Medoids Centers:\\n", kmed.cluster_centers_)' };

  var p12 = { title: 'Regression using WEKA',
    aim: 'Evaluate regression techniques using WEKA.',
    code: '// WEKA Regression Steps:\n// 1. Open WEKA Explorer → Preprocess → Open housing.arff\n// 2. Classify → Choose → functions → LinearRegression\n// 3. Test: Cross-validation, 10 folds → Start\n// 4. Read output: Correlation coefficient, MAE, RMSE\n\n// ARFF Format:\n// @relation housing\n// @attribute size NUMERIC\n// @attribute bedrooms NUMERIC\n// @attribute price NUMERIC\n// @data\n// 1500, 3, 250000\n// 2000, 4, 350000\n// 1200, 2, 180000\n\n// Other algorithms to compare:\n// SMOreg (SVM), M5P (model tree), MultilayerPerceptron' };

  var p13 = { title: 'Binning and Histogram Analysis',
    aim: 'Implement binning and histogram analysis.',
    code: '# Binning and Histogram\nimport pandas as pd, numpy as np, matplotlib.pyplot as plt\nnp.random.seed(42)\nages = np.clip(np.random.normal(35,12,200).astype(int), 18, 70)\ndf = pd.DataFrame({"age": ages})\n# Equal-width binning\ndf["ew_bin"] = pd.cut(df["age"], bins=5)\nprint("Equal-Width:\\n", df["ew_bin"].value_counts().sort_index())\n# Equal-frequency binning\ndf["ef_bin"] = pd.qcut(df["age"], q=5, duplicates="drop")\nprint("\\nEqual-Freq:\\n", df["ef_bin"].value_counts().sort_index())\n# Custom bins\ndf["custom"] = pd.cut(df["age"], bins=[0,25,35,45,55,100], labels=["<25","25-35","35-45","45-55","55+"])\n# Histogram\nplt.hist(ages, bins=10, color="steelblue", edgecolor="black")\nplt.title("Age Distribution"); plt.xlabel("Age"); plt.ylabel("Freq")\nplt.savefig("histogram.png"); print("Saved histogram.png")' };

  var p14 = { title: 'Classification Process on Given Data',
    aim: 'Demonstrate classification process on given data.',
    code: '# Decision Tree Classification - Iris Dataset\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier, export_text\nfrom sklearn.metrics import accuracy_score, classification_report\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n  iris.data, iris.target, test_size=0.3, random_state=42, stratify=iris.target)\ndt = DecisionTreeClassifier(max_depth=3, random_state=42)\ndt.fit(X_train, y_train)\ny_pred = dt.predict(X_test)\nprint("Accuracy:", accuracy_score(y_test, y_pred))\nprint(classification_report(y_test, y_pred, target_names=iris.target_names))\nprint(export_text(dt, feature_names=iris.feature_names))' };

  var p15 = { title: 'Compare Classifiers using Confusion Matrix',
    aim: 'Compare classification algorithm accuracies using a confusion matrix.',
    code: '# Compare Classifiers\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.naive_bayes import GaussianNB\nfrom sklearn.svm import SVC\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score, confusion_matrix\ndata = load_breast_cancer()\nX_tr, X_te, y_tr, y_te = train_test_split(data.data, data.target, test_size=0.3, random_state=42)\nclfs = {"Decision Tree": DecisionTreeClassifier(random_state=42),\n  "Naive Bayes": GaussianNB(), "SVM": SVC(random_state=42), "KNN": KNeighborsClassifier()}\nfor name, clf in clfs.items():\n  clf.fit(X_tr, y_tr); pred = clf.predict(X_te)\n  print(f"{name}: Accuracy={accuracy_score(y_te,pred):.4f}")\n  print("Confusion Matrix:\\n", confusion_matrix(y_te, pred), "\\n")' };

  practicalData.push(p6, p7, p8, p9, p10, p11, p12, p13, p14, p15);

  var saved = loadSaved();
  $scope.practicals = practicalData.map(function(p, i) {
    var id = i + 1, s = saved[id] || {};
    return { id:id, title:p.title, aim:p.aim, code:p.code,
      completed: s.completed||false, notes: s.notes||'', showCode:false };
  });

  $scope.toggleComplete = function(p) { p.completed = !p.completed; save(); };
  $scope.toggleCode = function(p) { p.showCode = !p.showCode; };
  $scope.saveNotes = function() { save(); };
  $scope.completedCount = function() {
    return $scope.practicals.filter(function(p) { return p.completed; }).length;
  };
}]);
