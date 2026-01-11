import AuditLog from '../models/AuditLog.js';

// Audit logging middleware
export const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    // Override send function to log after successful operations
    res.send = async function (data) {
      // Only log on successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          let entityId = null;
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

          // Extract entity ID from response
          if (parsedData && parsedData.data) {
            entityId = parsedData.data._id || parsedData.data.id;
          }

          // Create audit log entry
          await AuditLog.create({
            action,
            userId: req.user._id,
            entityType,
            entityId: entityId || req.params.id,
            changes: {
              method: req.method,
              path: req.path,
              body: req.body,
            },
            ipAddress: req.ip || req.connection.remoteAddress,
          });
        } catch (error) {
          console.error('Audit logging error:', error);
          // Don't fail the request if audit logging fails
        }
      }

      // Call original send
      originalSend.call(this, data);
    };

    next();
  };
};
