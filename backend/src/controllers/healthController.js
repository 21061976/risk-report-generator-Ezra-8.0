const os = require('os');
const process = require('process');

const getHealthStatus = (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus().length
      },
      services: {
        claude_api: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing',
        file_uploads: 'operational',
        report_generation: 'operational'
      }
    };

    res.json({
      success: true,
      health: healthStatus
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
};

const getSystemMetrics = (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      system: {
        loadavg: os.loadavg(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        networkInterfaces: Object.keys(os.networkInterfaces())
      }
    };

    res.json({
      success: true,
      metrics
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getHealthStatus,
  getSystemMetrics
};
