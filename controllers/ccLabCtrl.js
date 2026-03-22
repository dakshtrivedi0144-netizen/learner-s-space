angular.module('learningPortalApp')
.controller('CCLabCtrl', ['$scope', function($scope) {

  var STORAGE_KEY = 'ulp_cc_practicals';

  function loadSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch(e) { return {}; }
  }

  function save() {
    var data = {};
    $scope.practicals.forEach(function(p) {
      data[p.id] = { completed: p.completed, notes: p.notes };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  var practicalData = [
    { title: 'Cloud Service Models with Real-time Examples',
      aim: 'Describe and discuss cloud service models (IaaS, PaaS, SaaS) with real-time examples.',
      code: '// IaaS Example: AWS EC2\n// You get a virtual machine — you manage OS, runtime, apps\n// Provider manages: hardware, networking, virtualization\n\n// PaaS Example: Google App Engine\n// You deploy code — provider manages OS, runtime, scaling\n// Provider manages: hardware, OS, middleware, runtime\n\n// SaaS Example: Gmail / Office 365\n// You just use the app — provider manages everything\n// Provider manages: hardware, OS, runtime, application\n\n// Real-time comparison:\n// IaaS: AWS EC2, Azure VMs, Google Compute Engine\n// PaaS: Heroku, Google App Engine, AWS Elastic Beanstalk\n// SaaS: Gmail, Salesforce, Dropbox, Office 365' },
    { title: 'Create EC2 Instance for Windows on AWS',
      aim: 'Apply the AWS console to create an EC2 instance for Windows.',
      code: '// Steps to create Windows EC2 instance:\n// 1. Login to AWS Console → EC2 → Launch Instance\n// 2. Name: "MyWindowsServer"\n// 3. AMI: Select "Windows Server 2022 Base"\n// 4. Instance Type: t2.micro (free tier)\n// 5. Key Pair: Create new → "my-key-pair" → Download .pem\n// 6. Security Group: Allow RDP (port 3389) from My IP\n// 7. Storage: 30 GB gp2 (default)\n// 8. Click "Launch Instance"\n// 9. Connect: EC2 → Instance → Connect → RDP Client\n// 10. Get Password using .pem key → Open RDP → Connect\n\n// AWS CLI equivalent:\n// aws ec2 run-instances \\\n//   --image-id ami-0c02fb55956c7d316 \\\n//   --instance-type t2.micro \\\n//   --key-name my-key-pair' },
    { title: 'Create S3 Bucket and Store Image File',
      aim: 'Demonstrate the creation of an S3 Bucket, store an image file, and use the generated URL to open it.',
      code: '// Steps to create S3 bucket and upload image:\n// 1. AWS Console → S3 → Create Bucket\n// 2. Bucket name: "my-demo-bucket-2024" (must be globally unique)\n// 3. Region: us-east-1\n// 4. Uncheck "Block all public access" → Acknowledge\n// 5. Click "Create Bucket"\n// 6. Open bucket → Upload → Add files → Select image.jpg\n// 7. Click Upload\n// 8. Click on uploaded file → Object URL\n// 9. URL format: https://my-demo-bucket-2024.s3.amazonaws.com/image.jpg\n\n// To make object public:\n// Object → Actions → Make Public using ACL\n\n// AWS CLI:\n// aws s3 mb s3://my-demo-bucket-2024\n// aws s3 cp image.jpg s3://my-demo-bucket-2024/\n// aws s3 presign s3://my-demo-bucket-2024/image.jpg' },
    { title: 'S3 Versioning',
      aim: 'Analyze S3 versioning by creating an S3 bucket, enabling versioning, and showing different versions of bucket files.',
      code: '// Steps to enable and test S3 versioning:\n// 1. Create S3 bucket: "versioning-demo-bucket"\n// 2. Bucket → Properties → Versioning → Enable\n// 3. Upload file: hello.txt (content: "Version 1")\n// 4. Upload same file: hello.txt (content: "Version 2")\n// 5. Upload same file: hello.txt (content: "Version 3")\n// 6. Bucket → Show Versions toggle → See all 3 versions\n// 7. Each version has unique Version ID\n// 8. Download specific version by clicking version ID\n// 9. Delete a version: select version → Delete\n// 10. Restore: delete the latest version to restore previous\n\n// AWS CLI:\n// aws s3api put-bucket-versioning \\\n//   --bucket versioning-demo-bucket \\\n//   --versioning-configuration Status=Enabled\n// aws s3api list-object-versions \\\n//   --bucket versioning-demo-bucket' },
    { title: 'Create EBS Volume and Attach to EC2',
      aim: 'Demonstrate the creation of an EBS volume, attach it to an EC2 instance, store a file on the volume.',
      code: '// Steps to create and attach EBS volume:\n// 1. EC2 → Elastic Block Store → Volumes → Create Volume\n// 2. Volume Type: gp2, Size: 10 GB\n// 3. Availability Zone: same as your EC2 instance (e.g., us-east-1a)\n// 4. Create Volume\n// 5. Select volume → Actions → Attach Volume\n// 6. Select your EC2 instance → Device: /dev/sdf → Attach\n\n// On Linux EC2 (SSH in):\n// sudo lsblk                    # list block devices\n// sudo mkfs -t ext4 /dev/xvdf   # format volume\n// sudo mkdir /mydata             # create mount point\n// sudo mount /dev/xvdf /mydata  # mount volume\n// echo "Hello EBS" | sudo tee /mydata/test.txt\n// cat /mydata/test.txt\n\n// Detach:\n// sudo umount /mydata\n// AWS Console → Volume → Detach' },
    { title: 'Create EC2 Instance for Ubuntu on AWS',
      aim: 'Apply the AWS console to create an EC2 instance for Ubuntu.',
      code: '// Steps to create Ubuntu EC2 instance:\n// 1. AWS Console → EC2 → Launch Instance\n// 2. Name: "MyUbuntuServer"\n// 3. AMI: Ubuntu Server 22.04 LTS (Free tier eligible)\n// 4. Instance Type: t2.micro\n// 5. Key Pair: Select existing or create new .pem key\n// 6. Security Group: Allow SSH (port 22) from My IP\n//    Allow HTTP (port 80) from Anywhere\n// 7. Storage: 8 GB gp2\n// 8. Launch Instance\n\n// Connect via SSH:\n// chmod 400 my-key-pair.pem\n// ssh -i "my-key-pair.pem" ubuntu@<public-ip>\n\n// Basic setup after login:\n// sudo apt update && sudo apt upgrade -y\n// sudo apt install apache2 -y\n// sudo systemctl start apache2\n// # Visit http://<public-ip> to see Apache page' },
    { title: 'AWS Pricing Calculator',
      aim: 'Outline the functionality of the AWS Pricing Calculator.',
      code: '// AWS Pricing Calculator: https://calculator.aws/pricing/2/home\n\n// Steps to estimate cost:\n// 1. Go to calculator.aws → Create Estimate\n// 2. Add Service → Search "EC2"\n// 3. Configure: Region, OS, Instance type, Usage hours\n// 4. Example: t2.micro, Linux, 730 hrs/month = ~$8.47/month\n// 5. Add Service → S3\n// 6. Configure: Storage 100GB, Requests 10,000 = ~$2.36/month\n// 7. Add Service → RDS\n// 8. Configure: db.t3.micro, MySQL, 730 hrs = ~$24.82/month\n// 9. View Summary → Total monthly estimate\n// 10. Export as CSV or share link\n\n// Key pricing models:\n// On-Demand: pay per hour, no commitment\n// Reserved: 1-3 year commitment, up to 72% discount\n// Spot: bid for unused capacity, up to 90% discount\n// Savings Plans: flexible commitment, up to 66% discount' },
    { title: 'Different Services of AWS',
      aim: 'Illustrate and explain different services of AWS.',
      code: '// AWS Services Overview:\n\n// COMPUTE:\n// EC2 - Virtual servers in the cloud\n// Lambda - Serverless functions (pay per execution)\n// ECS/EKS - Container orchestration\n// Elastic Beanstalk - PaaS for web apps\n\n// STORAGE:\n// S3 - Object storage (unlimited, 99.999999999% durability)\n// EBS - Block storage for EC2\n// EFS - Elastic file system (NFS)\n// Glacier - Archive storage (cheap, slow retrieval)\n\n// DATABASE:\n// RDS - Managed relational DB (MySQL, PostgreSQL, Oracle)\n// DynamoDB - NoSQL key-value store\n// ElastiCache - In-memory cache (Redis, Memcached)\n// Redshift - Data warehouse\n\n// NETWORKING:\n// VPC - Virtual Private Cloud (isolated network)\n// Route 53 - DNS service\n// CloudFront - CDN (content delivery network)\n// ELB - Elastic Load Balancer\n\n// SECURITY:\n// IAM - Identity and Access Management\n// KMS - Key Management Service\n// Shield - DDoS protection\n// WAF - Web Application Firewall' },
    { title: 'Deploy IIS on EC2 Ubuntu Server',
      aim: 'Design a strategy to deploy IIS on an EC2 Ubuntu server.',
      code: '// Note: IIS is a Windows web server. On Ubuntu we use Apache/Nginx.\n// Strategy: Deploy Apache2 as equivalent web server on Ubuntu EC2\n\n// Step 1: Launch Ubuntu EC2 (t2.micro, port 80 open)\n// Step 2: SSH into instance\n// ssh -i key.pem ubuntu@<public-ip>\n\n// Step 3: Install Apache2\n// sudo apt update\n// sudo apt install apache2 -y\n// sudo systemctl enable apache2\n// sudo systemctl start apache2\n\n// Step 4: Create a web page\n// sudo nano /var/www/html/index.html\n// Add: <h1>Hello from Ubuntu EC2!</h1>\n\n// Step 5: Verify\n// curl http://localhost\n// Open browser: http://<public-ip>\n\n// For actual IIS on Windows EC2:\n// 1. Launch Windows Server EC2\n// 2. RDP into instance\n// 3. Server Manager → Add Roles → Web Server (IIS)\n// 4. Install → Restart\n// 5. Visit http://<public-ip> → IIS default page' },
    { title: 'Aneka/Eucalyptus Architecture',
      aim: 'Sketch and analyze Aneka/Eucalyptus, then identify different entities to understand its architecture.',
      code: '// EUCALYPTUS ARCHITECTURE:\n// Components:\n// 1. Cloud Controller (CLC) - top-level admin, manages cloud\n// 2. Walrus - S3-compatible object storage\n// 3. Cluster Controller (CC) - manages clusters\n// 4. Storage Controller (SC) - EBS-compatible block storage\n// 5. Node Controller (NC) - runs on each physical node, manages VMs\n\n// Flow: User → CLC → CC → NC → VM\n// CLC authenticates, CC schedules, NC launches VM\n\n// ANEKA ARCHITECTURE:\n// Components:\n// 1. Aneka Master - resource management, scheduling, SLA\n// 2. Aneka Workers - execute tasks on cloud nodes\n// 3. Application Container - hosts user applications\n// 4. Fabric Services - resource discovery, monitoring\n// 5. Foundation Services - storage, communication\n// 6. Programming Models - Thread, Task, MapReduce\n\n// Aneka supports:\n// - Private cloud deployment\n// - Hybrid cloud (local + public cloud burst)\n// - SLA-based scheduling\n// - Multiple programming models' },
    { title: 'Microsoft Windows Azure Architecture',
      aim: 'Sketch out and examine the architecture of Microsoft Windows Azure.',
      code: '// WINDOWS AZURE ARCHITECTURE:\n\n// Core Components:\n// 1. Azure Fabric Controller\n//    - Manages physical servers in data centers\n//    - Handles provisioning, monitoring, failover\n\n// 2. Azure Compute\n//    - Virtual Machines (IaaS)\n//    - App Service (PaaS)\n//    - Azure Functions (Serverless)\n//    - Container Instances / AKS\n\n// 3. Azure Storage\n//    - Blob Storage (objects)\n//    - Table Storage (NoSQL)\n//    - Queue Storage (messaging)\n//    - File Storage (SMB shares)\n\n// 4. Azure Networking\n//    - Virtual Network (VNet)\n//    - Azure Load Balancer\n//    - Application Gateway (WAF)\n//    - Azure CDN\n\n// 5. Azure Active Directory\n//    - Identity and access management\n//    - SSO, MFA, Conditional Access\n\n// 6. Azure Resource Manager (ARM)\n//    - Unified management layer\n//    - Deploy via ARM templates (JSON/Bicep)\n//    - Resource groups for organization\n\n// Deployment model:\n// User → Azure Portal/CLI → ARM → Resource Providers → Resources' },
    { title: 'Host Static Website on S3',
      aim: 'Implement and use S3 to host a static website.',
      code: '// Steps to host static website on S3:\n// 1. Create S3 bucket (name = your domain, e.g., "mywebsite.com")\n// 2. Uncheck "Block all public access"\n// 3. Bucket → Properties → Static Website Hosting → Enable\n// 4. Index document: index.html\n// 5. Error document: error.html\n// 6. Save\n\n// 7. Create index.html:\n// <!DOCTYPE html>\n// <html>\n// <head><title>My Cloud Website</title></head>\n// <body>\n//   <h1>Welcome to My S3 Static Website!</h1>\n//   <p>Hosted on AWS S3</p>\n// </body>\n// </html>\n\n// 8. Upload index.html to bucket\n// 9. Bucket Policy → Add policy to make public:\n// {\n//   "Version": "2012-10-17",\n//   "Statement": [{\n//     "Effect": "Allow",\n//     "Principal": "*",\n//     "Action": "s3:GetObject",\n//     "Resource": "arn:aws:s3:::mywebsite.com/*"\n//   }]\n// }\n// 10. Website URL: http://mywebsite.com.s3-website-us-east-1.amazonaws.com' },
    { title: 'Auto Scaling using EC2 Windows',
      aim: 'Implement auto scaling using EC2 Windows using AWS (security groups and firewalls) for an EC2 instance.',
      code: '// Steps to set up Auto Scaling:\n// 1. Create Launch Template:\n//    EC2 → Launch Templates → Create\n//    AMI: Windows Server 2022\n//    Instance type: t2.micro\n//    Security Group: Allow RDP (3389), HTTP (80)\n\n// 2. Create Auto Scaling Group:\n//    EC2 → Auto Scaling Groups → Create\n//    Launch Template: select above\n//    VPC: default, Subnets: select 2+ AZs\n//    Min: 1, Desired: 2, Max: 5\n\n// 3. Attach Load Balancer:\n//    Create ALB → Target Group → Attach to ASG\n\n// 4. Create Scaling Policy:\n//    Dynamic Scaling → Target Tracking\n//    Metric: Average CPU Utilization\n//    Target: 70%\n//    Scale out: add instance when CPU > 70%\n//    Scale in: remove instance when CPU < 70%\n\n// 5. Security Group rules:\n//    Inbound: HTTP (80) from 0.0.0.0/0\n//    Inbound: RDP (3389) from My IP only\n//    Outbound: All traffic allowed\n\n// 6. Test: stress test CPU → watch new instances launch' },
    { title: 'Host Static Website on Ubuntu Server',
      aim: 'Implement and use an Ubuntu server to host a static website.',
      code: '// Steps to host website on Ubuntu EC2:\n// 1. Launch Ubuntu EC2 (t2.micro)\n//    Security Group: SSH (22), HTTP (80), HTTPS (443)\n\n// 2. SSH into instance:\n// ssh -i key.pem ubuntu@<public-ip>\n\n// 3. Install Nginx:\n// sudo apt update\n// sudo apt install nginx -y\n// sudo systemctl enable nginx\n// sudo systemctl start nginx\n\n// 4. Create website:\n// sudo nano /var/www/html/index.html\n// Content:\n// <!DOCTYPE html>\n// <html>\n// <head><title>Cloud Computing Lab</title></head>\n// <body style="font-family:Arial; text-align:center; padding:50px">\n//   <h1>Cloud Computing - 6th Sem</h1>\n//   <p>Hosted on AWS EC2 Ubuntu with Nginx</p>\n//   <p>BTech Computer Engineering</p>\n// </body>\n// </html>\n\n// 5. Set permissions:\n// sudo chmod 644 /var/www/html/index.html\n\n// 6. Visit: http://<public-ip>\n// Should show your custom page' },
    { title: 'Deploy IIS Windows Server using EC2',
      aim: 'Demonstrate and make publicly available an IIS Windows Server using an EC2 instance.',
      code: '// Steps to deploy public IIS on Windows EC2:\n// 1. Launch Windows Server 2022 EC2\n//    Security Group: RDP (3389) My IP, HTTP (80) Anywhere\n\n// 2. Connect via RDP:\n//    EC2 → Connect → RDP Client → Get Password\n//    Use .pem key to decrypt password\n//    Open Remote Desktop → Enter public IP + credentials\n\n// 3. Install IIS:\n//    Server Manager → Add Roles and Features\n//    Role: Web Server (IIS) → Install\n//    Wait for installation → Close\n\n// 4. Create web page:\n//    Open File Explorer → C:\\inetpub\\wwwroot\\\n//    Edit index.html:\n//    <html><body>\n//    <h1>IIS on AWS EC2 Windows Server</h1>\n//    <p>Cloud Computing Lab - BTech CE</p>\n//    </body></html>\n\n// 5. Test locally:\n//    Open IE/Edge → http://localhost → IIS page\n\n// 6. Make public:\n//    Ensure Security Group allows HTTP (80) from 0.0.0.0/0\n//    Visit: http://<public-ip> from any browser\n//    Your IIS page is now publicly accessible!' }
  ];

  var saved = loadSaved();

  $scope.practicals = practicalData.map(function(p, i) {
    var id = i + 1;
    var s = saved[id] || {};
    return {
      id: id,
      title: p.title,
      aim: p.aim,
      code: p.code,
      completed: s.completed || false,
      notes: s.notes || '',
      showCode: false
    };
  });

  $scope.toggleComplete = function(practical) {
    practical.completed = !practical.completed;
    save();
  };

  $scope.toggleCode = function(practical) {
    practical.showCode = !practical.showCode;
  };

  $scope.saveNotes = function() { save(); };

  $scope.completedCount = function() {
    return $scope.practicals.filter(function(p) { return p.completed; }).length;
  };
}]);
