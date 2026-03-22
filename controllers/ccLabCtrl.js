angular.module('learningPortalApp')
.controller('CCLabCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {

  var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
  if (!user) { $location.path('/login'); return; }
  if (user.role === 'admin') { $location.path('/admin'); return; }
  if (user.role === 'faculty') { $location.path('/faculty'); return; }

  var SUBJECT_ID   = 'cloud-computing';
  var PROGRESS_KEY = 'ulp_progress_' + SUBJECT_ID;

  var defaultPracticals = [
    { title:'Cloud Service Models with Real-time Examples', aim:'Describe and discuss cloud service models (IaaS, PaaS, SaaS) with real-time examples.', code:'// IaaS: AWS EC2 — you manage OS, runtime, apps\n// PaaS: Google App Engine — you deploy code only\n// SaaS: Gmail — you just use the app\n// IaaS examples: AWS EC2, Azure VMs, Google Compute Engine\n// PaaS examples: Heroku, Google App Engine, AWS Elastic Beanstalk\n// SaaS examples: Gmail, Salesforce, Dropbox, Office 365' },
    { title:'Create EC2 Instance for Windows on AWS', aim:'Apply the AWS console to create an EC2 instance for Windows.', code:'// 1. AWS Console → EC2 → Launch Instance\n// 2. Name: "MyWindowsServer"\n// 3. AMI: Windows Server 2022 Base\n// 4. Instance Type: t2.micro (free tier)\n// 5. Key Pair: Create new → Download .pem\n// 6. Security Group: Allow RDP (port 3389) from My IP\n// 7. Storage: 30 GB gp2\n// 8. Launch Instance\n// 9. Connect: EC2 → Instance → Connect → RDP Client\n// AWS CLI: aws ec2 run-instances --image-id ami-xxx --instance-type t2.micro --key-name my-key' },
    { title:'Create S3 Bucket and Store Image File', aim:'Demonstrate the creation of an S3 Bucket, store an image file, and use the generated URL to open it.', code:'// 1. AWS Console → S3 → Create Bucket\n// 2. Bucket name: "my-demo-bucket-2024" (globally unique)\n// 3. Uncheck "Block all public access"\n// 4. Upload image.jpg → Object URL generated\n// URL: https://my-demo-bucket-2024.s3.amazonaws.com/image.jpg\n// AWS CLI:\n// aws s3 mb s3://my-demo-bucket-2024\n// aws s3 cp image.jpg s3://my-demo-bucket-2024/' },
    { title:'S3 Versioning', aim:'Analyze S3 versioning by creating an S3 bucket, enabling versioning, and showing different versions.', code:'// 1. Create bucket → Properties → Versioning → Enable\n// 2. Upload hello.txt (Version 1)\n// 3. Upload same hello.txt (Version 2)\n// 4. Show Versions toggle → See all versions with unique IDs\n// AWS CLI:\n// aws s3api put-bucket-versioning --bucket my-bucket --versioning-configuration Status=Enabled\n// aws s3api list-object-versions --bucket my-bucket' },
    { title:'Create EBS Volume and Attach to EC2', aim:'Demonstrate the creation of an EBS volume, attach it to an EC2 instance, store a file on the volume.', code:'// 1. EC2 → Volumes → Create Volume (gp2, 10GB, same AZ as EC2)\n// 2. Attach to EC2 instance → /dev/sdf\n// On Linux EC2:\n// sudo lsblk\n// sudo mkfs -t ext4 /dev/xvdf\n// sudo mkdir /mydata\n// sudo mount /dev/xvdf /mydata\n// echo "Hello EBS" | sudo tee /mydata/test.txt' },
    { title:'Create EC2 Instance for Ubuntu on AWS', aim:'Apply the AWS console to create an EC2 instance for Ubuntu.', code:'// 1. EC2 → Launch Instance\n// 2. AMI: Ubuntu Server 22.04 LTS\n// 3. Instance Type: t2.micro\n// 4. Security Group: SSH (22), HTTP (80)\n// Connect:\n// chmod 400 my-key.pem\n// ssh -i "my-key.pem" ubuntu@<public-ip>\n// sudo apt update && sudo apt install apache2 -y' },
    { title:'AWS Pricing Calculator', aim:'Outline the functionality of the AWS Pricing Calculator.', code:'// URL: https://calculator.aws/pricing/2/home\n// 1. Create Estimate → Add Service → EC2\n// 2. t2.micro, Linux, 730 hrs/month ≈ $8.47/month\n// 3. Add S3: 100GB storage ≈ $2.36/month\n// 4. Add RDS: db.t3.micro, MySQL ≈ $24.82/month\n// Pricing models:\n// On-Demand: pay per hour\n// Reserved: 1-3 year, up to 72% discount\n// Spot: up to 90% discount\n// Savings Plans: up to 66% discount' },
    { title:'Different Services of AWS', aim:'Illustrate and explain different services of AWS.', code:'// COMPUTE: EC2, Lambda, ECS, Elastic Beanstalk\n// STORAGE: S3, EBS, EFS, Glacier\n// DATABASE: RDS, DynamoDB, ElastiCache, Redshift\n// NETWORKING: VPC, Route 53, CloudFront, ELB\n// SECURITY: IAM, KMS, Shield, WAF\n// ANALYTICS: EMR, Athena, Kinesis, QuickSight\n// AI/ML: SageMaker, Rekognition, Comprehend' },
    { title:'Deploy IIS on EC2 Ubuntu Server', aim:'Design a strategy to deploy IIS on an EC2 Ubuntu server.', code:'// Note: IIS is Windows-only. On Ubuntu use Apache2/Nginx.\n// sudo apt update\n// sudo apt install apache2 -y\n// sudo systemctl enable apache2\n// sudo nano /var/www/html/index.html\n// Add: <h1>Hello from Ubuntu EC2!</h1>\n// Visit: http://<public-ip>' },
    { title:'Aneka/Eucalyptus Architecture', aim:'Sketch and analyze Aneka/Eucalyptus architecture.', code:'// EUCALYPTUS:\n// CLC (Cloud Controller) → CC (Cluster Controller) → NC (Node Controller)\n// Walrus = S3-compatible storage\n// SC = EBS-compatible block storage\n\n// ANEKA:\n// Master: resource management, scheduling, SLA\n// Workers: execute tasks\n// Programming Models: Thread, Task, MapReduce\n// Supports private + hybrid cloud deployment' },
    { title:'Microsoft Windows Azure Architecture', aim:'Sketch out and examine the architecture of Microsoft Windows Azure.', code:'// Azure Fabric Controller: manages physical servers\n// Azure Compute: VMs, App Service, Functions, AKS\n// Azure Storage: Blob, Table, Queue, File\n// Azure Networking: VNet, Load Balancer, CDN, App Gateway\n// Azure Active Directory: SSO, MFA, Conditional Access\n// ARM (Azure Resource Manager): unified management layer\n// Deploy via ARM templates (JSON/Bicep)' },
    { title:'Host Static Website on S3', aim:'Implement and use S3 to host a static website.', code:'// 1. Create S3 bucket (name = domain)\n// 2. Properties → Static Website Hosting → Enable\n// 3. Index: index.html, Error: error.html\n// 4. Upload index.html\n// 5. Bucket Policy:\n// { "Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::bucket/*" }\n// URL: http://bucket.s3-website-us-east-1.amazonaws.com' },
    { title:'Auto Scaling using EC2 Windows', aim:'Implement auto scaling using EC2 Windows.', code:'// 1. Create Launch Template (Windows Server 2022, t2.micro)\n// 2. Create Auto Scaling Group\n//    Min:1, Desired:2, Max:5\n// 3. Attach Application Load Balancer\n// 4. Scaling Policy: Target Tracking\n//    Metric: CPU Utilization, Target: 70%\n// Security Group: HTTP(80) from 0.0.0.0/0, RDP(3389) from My IP' },
    { title:'Host Static Website on Ubuntu Server', aim:'Implement and use an Ubuntu server to host a static website.', code:'// 1. Launch Ubuntu EC2 (HTTP port 80 open)\n// 2. ssh -i key.pem ubuntu@<public-ip>\n// 3. sudo apt install nginx -y\n// 4. sudo nano /var/www/html/index.html\n// Content:\n// <h1>Cloud Computing Lab</h1>\n// <p>Hosted on AWS EC2 Ubuntu with Nginx</p>\n// 5. Visit: http://<public-ip>' },
    { title:'Deploy IIS Windows Server using EC2', aim:'Demonstrate and make publicly available an IIS Windows Server using an EC2 instance.', code:'// 1. Launch Windows Server 2022 EC2\n// 2. RDP into instance (get password using .pem key)\n// 3. Server Manager → Add Roles → Web Server (IIS) → Install\n// 4. C:\\inetpub\\wwwroot\\index.html:\n//    <h1>IIS on AWS EC2 Windows Server</h1>\n// 5. Security Group: HTTP(80) from 0.0.0.0/0\n// 6. Visit: http://<public-ip>' }
  ];

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch(e) { return {}; }
  }
  function saveProgress() {
    var data = {};
    $scope.practicals.forEach(function(p) { data[p.id] = { completed: p.completed, notes: p.notes }; });
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  }
  function buildList(source) {
    var progress = loadProgress();
    $scope.practicals = source.map(function(p, i) {
      var id = i + 1, s = progress[id] || {};
      return { id:id, title:p.title, aim:p.aim, code:p.code,
               completed: s.completed||false, notes: s.notes||'', showCode:false };
    });
  }

  FirebaseService.getPracticals(SUBJECT_ID).then(function(list) {
    buildList(list && list.length ? list : defaultPracticals);
  });

  $scope.toggleComplete = function(p) { p.completed = !p.completed; saveProgress(); };
  $scope.toggleCode     = function(p) { p.showCode = !p.showCode; };
  $scope.saveNotes      = function()  { saveProgress(); };
  $scope.completedCount = function()  { return $scope.practicals.filter(function(p){return p.completed;}).length; };
}]);
