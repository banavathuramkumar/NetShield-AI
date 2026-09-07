const Alert = require('../models/Alert');
const Incident = require('../models/Incident');
const Notification = require('../models/Notification');
const ThreatIntelligence = require('../models/ThreatIntelligence');
const Report = require('../models/Report');
const User = require('../models/User');
const logger = require('./logger');

let isSeeding = false;

const autoSeedIfEmpty = async () => {
  if (isSeeding) return;
  try {
    const alertCount = await Alert.countDocuments();
    if (alertCount > 0) return; // DB already has data

    isSeeding = true;
    logger.info('Auto-seeding default SOC demo data into MongoDB Atlas...');

    // 1. Ensure default users exist
    let admin = await User.findOne({ email: 'admin@netshield.ai' });
    if (!admin) {
      admin = await User.create({
        name: 'Security Administrator',
        email: 'admin@netshield.ai',
        password: 'password123',
        role: 'admin',
        status: 'active'
      });
    }

    let analyst = await User.findOne({ email: 'analyst@netshield.ai' });
    if (!analyst) {
      analyst = await User.create({
        name: 'Senior SOC Analyst',
        email: 'analyst@netshield.ai',
        password: 'password123',
        role: 'analyst',
        status: 'active'
      });
    }

    const adminId = admin._id.toString();
    const analystId = analyst._id.toString();

    // 2. Seed Alerts
    const alerts = [
      {
        alertId: 'ALT-1001',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        sourceIp: '192.168.1.108',
        destinationIp: '10.0.0.15',
        sourcePort: 54120,
        destinationPort: 80,
        protocol: 'TCP',
        attackType: 'DDoS',
        category: 'Volumetric DDoS Attack',
        severity: 'CRITICAL',
        confidenceScore: 0.98,
        riskScore: 94,
        modelUsed: 'Random Forest',
        status: 'INVESTIGATING',
        assignedTo: analystId,
        assignedToName: analyst.name,
        incidentId: 'INC-2001',
        description: 'High-volume HTTP flood targeting web application gateway. Peak rate 1.45 Gbps.',
        recommendation: 'Implement upstream BGP flowspec rate-limiting and deploy WAF mitigation rules.',
        occurrenceCount: 42,
        isDemoData: true
      },
      {
        alertId: 'ALT-1002',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        sourceIp: '192.168.1.120',
        destinationIp: '10.0.0.8',
        sourcePort: 48920,
        destinationPort: 22,
        protocol: 'TCP',
        attackType: 'SSH-Patator',
        category: 'Brute Force Intrusion',
        severity: 'HIGH',
        confidenceScore: 0.94,
        riskScore: 78,
        modelUsed: 'XGBoost',
        status: 'ACKNOWLEDGED',
        assignedTo: analystId,
        assignedToName: analyst.name,
        incidentId: 'INC-2002',
        description: 'SSH password brute-force attack detected from 192.168.1.120.',
        recommendation: 'Enforce SSH key-based authentication and block offending IP at border firewall.',
        occurrenceCount: 18,
        isDemoData: true
      },
      {
        alertId: 'ALT-1003',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000),
        sourceIp: '192.168.1.105',
        destinationIp: '10.0.0.15',
        sourcePort: 33412,
        destinationPort: 80,
        protocol: 'TCP',
        attackType: 'DoS Hulk',
        category: 'Denial of Service',
        severity: 'CRITICAL',
        confidenceScore: 0.96,
        riskScore: 88,
        modelUsed: 'Random Forest',
        status: 'NEW',
        assignedToName: null,
        description: 'Hulk DoS flood detected targeting core web service API endpoints.',
        recommendation: 'Enable HTTP connection throttling and inspect web server connection pools.',
        occurrenceCount: 7,
        isDemoData: true
      },
      {
        alertId: 'ALT-1004',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000),
        sourceIp: '192.168.1.199',
        destinationIp: '10.0.0.50',
        sourcePort: 60100,
        destinationPort: 8080,
        protocol: 'TCP',
        attackType: 'Botnet',
        category: 'Command & Control Telemetry',
        severity: 'CRITICAL',
        confidenceScore: 0.99,
        riskScore: 92,
        modelUsed: 'Decision Tree',
        status: 'RESOLVED',
        assignedTo: adminId,
        assignedToName: admin.name,
        incidentId: 'INC-2003',
        description: 'Botnet command and control beaconing detected from internal host 192.168.1.199.',
        recommendation: 'Isolate compromised host immediately and initiate endpoint anti-malware scan.',
        occurrenceCount: 1,
        isDemoData: true
      },
      {
        alertId: 'ALT-1005',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000),
        sourceIp: '192.168.1.150',
        destinationIp: '10.0.0.2',
        sourcePort: 12044,
        destinationPort: 443,
        protocol: 'TCP',
        attackType: 'PortScan',
        category: 'Reconnaissance',
        severity: 'MEDIUM',
        confidenceScore: 0.89,
        riskScore: 62,
        modelUsed: 'Isolation Forest',
        status: 'NEW',
        description: 'Reconnaissance port scan targeting subnets 10.0.0.0/24.',
        recommendation: 'Audit exposed network ports and verify firewall ingress policies.',
        occurrenceCount: 2,
        isDemoData: true
      },
      {
        alertId: 'ALT-1006',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000),
        sourceIp: '192.168.1.105',
        destinationIp: '10.0.0.15',
        sourcePort: 38990,
        destinationPort: 80,
        protocol: 'TCP',
        attackType: 'Web Attack',
        category: 'Web Application Attack',
        severity: 'HIGH',
        confidenceScore: 0.92,
        riskScore: 82,
        modelUsed: 'Random Forest',
        status: 'NEW',
        description: 'Web application SQL injection attack pattern detected.',
        recommendation: 'Inspect HTTP payload for injection patterns and enable WAF rules.',
        occurrenceCount: 1,
        isDemoData: true
      }
    ];

    await Alert.insertMany(alerts);

    // 3. Seed Incidents
    const incidents = [
      {
        incidentId: 'INC-2001',
        title: 'Critical Distributed Denial of Service (DDoS) Attack on Core Gateway',
        description: 'Volumetric DDoS attack targeting web application gateway at 10.0.0.15.',
        severity: 'CRITICAL',
        priority: 'CRITICAL',
        status: 'INVESTIGATING',
        assignedTo: analystId,
        assignedToName: analyst.name,
        alerts: ['ALT-1001'],
        timeline: [
          {
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            action: 'INCIDENT_CREATED',
            performedBy: 'System AI Engine',
            details: 'Incident automatically created from Critical Alert ALT-1001'
          },
          {
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            action: 'STATUS_CHANGE',
            performedBy: analyst.name,
            details: 'Status updated to INVESTIGATING'
          }
        ],
        notes: [
          {
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            author: analyst.name,
            content: 'Upstream mitigation enabled. Rate limiting active.'
          }
        ],
        isDemoData: true
      },
      {
        incidentId: 'INC-2002',
        title: 'SSH Dictionary Brute Force Intrusion Attempt',
        description: 'Automated SSH brute-force attack from host 192.168.1.120.',
        severity: 'HIGH',
        priority: 'HIGH',
        status: 'ACKNOWLEDGED',
        assignedTo: analystId,
        assignedToName: analyst.name,
        alerts: ['ALT-1002'],
        timeline: [
          {
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            action: 'INCIDENT_CREATED',
            performedBy: analyst.name,
            details: 'Incident declared from alert ALT-1002'
          }
        ],
        notes: [],
        isDemoData: true
      },
      {
        incidentId: 'INC-2003',
        title: 'Application Denial of Service (DoS Hulk) Outage Threat',
        description: 'Application-layer DoS Hulk attack causing elevated memory consumption.',
        severity: 'HIGH',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        assignedTo: adminId,
        assignedToName: admin.name,
        alerts: ['ALT-1004'],
        timeline: [
          {
            timestamp: new Date(Date.now() - 2 * 3600 * 1000),
            action: 'INCIDENT_CREATED',
            performedBy: admin.name,
            details: 'Incident declared'
          },
          {
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            action: 'STATUS_CHANGE',
            performedBy: admin.name,
            details: 'Status changed to RESOLVED'
          }
        ],
        notes: [
          {
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            author: admin.name,
            content: 'Target IP blocked at firewall. Service fully restored.'
          }
        ],
        isDemoData: true
      }
    ];

    await Incident.insertMany(incidents);

    // 4. Seed Threat Intelligence
    const threatIntel = [
      {
        indicatorId: 'IND-3001',
        type: 'IP',
        value: '192.168.1.105',
        threatLevel: 'CRITICAL',
        maxRiskScore: 88,
        occurrences: 10,
        attackTypes: ['PortScan', 'Web Attack', 'DoS Hulk', 'DDoS'],
        category: 'Malicious Source IP',
        source: 'Internal Telemetry Sensor Node-01',
        isEnriched: true,
        enrichedData: {
          provider: 'AbuseIPDB Simulation',
          abuseConfidenceScore: 98,
          country: 'US',
          isp: 'Enterprise Network Segment',
          domain: 'host-105.internal.net',
          totalReports: 142
        },
        isDemoData: true
      },
      {
        indicatorId: 'IND-3002',
        type: 'IP',
        value: '192.168.1.199',
        threatLevel: 'HIGH',
        maxRiskScore: 92,
        occurrences: 1,
        attackTypes: ['Botnet'],
        category: 'Botnet C2 Node',
        source: 'Internal Telemetry Sensor Node-02',
        isEnriched: true,
        enrichedData: {
          provider: 'VirusTotal Simulation',
          abuseConfidenceScore: 95,
          country: 'DE',
          isp: 'Cloud Hosting Provider',
          domain: 'c2-botnet.external.org',
          totalReports: 89
        },
        isDemoData: true
      },
      {
        indicatorId: 'IND-3003',
        type: 'IP',
        value: '192.168.1.250',
        threatLevel: 'HIGH',
        maxRiskScore: 95,
        occurrences: 1,
        attackTypes: ['DDoS'],
        category: 'Volumetric Attacker',
        source: 'Internal Telemetry Sensor Node-01',
        isEnriched: false,
        isDemoData: true
      }
    ];

    await ThreatIntelligence.insertMany(threatIntel);

    // 5. Seed Notifications
    const notifications = [
      {
        notificationId: 'NOTIF-4001',
        type: 'CRITICAL_ALERT',
        title: 'CRITICAL Alert: DoS Hulk',
        message: 'High risk attack detected from 192.168.1.105 to 10.0.0.15:80. Risk Score: 88/100',
        severity: 'CRITICAL',
        isRead: false,
        relatedAlert: 'ALT-1003',
        isDemoData: true
      },
      {
        notificationId: 'NOTIF-4002',
        type: 'CRITICAL_ALERT',
        title: 'CRITICAL Alert: Web Attack',
        message: 'High risk attack detected from 192.168.1.105 to 10.0.0.15:80. Risk Score: 88/100',
        severity: 'CRITICAL',
        isRead: false,
        relatedAlert: 'ALT-1006',
        isDemoData: true
      },
      {
        notificationId: 'NOTIF-4003',
        type: 'CRITICAL_ALERT',
        title: 'CRITICAL Alert: DDoS',
        message: 'High risk attack detected from 192.168.1.108 to 10.0.0.15:80. Risk Score: 94/100',
        severity: 'CRITICAL',
        isRead: false,
        relatedAlert: 'ALT-1001',
        isDemoData: true
      }
    ];

    await Notification.insertMany(notifications);

    logger.info('✅ Auto-seeding completed successfully! MongoDB Atlas populated with default SOC data.');
  } catch (err) {
    logger.error('Auto-seeding error:', err.message);
  } finally {
    isSeeding = false;
  }
};

module.exports = { autoSeedIfEmpty };
