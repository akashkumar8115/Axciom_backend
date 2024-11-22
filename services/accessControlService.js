class AccessControlService {
    async validateAccess(userId, resourceId, action) {
        const user = await User.findById(userId).populate('roles');
        const resource = await Resource.findById(resourceId);

        const permissions = await this.getEffectivePermissions(user.roles);
        const resourcePolicy = await this.getResourcePolicy(resource.type);

        return this.evaluatePolicy(permissions, resourcePolicy, action);
    }

    async getEffectivePermissions(roles) {
        const permissions = new Set();

        for (const role of roles) {
            const rolePermissions = await Permission.find({ role: role._id });
            rolePermissions.forEach(p => permissions.add(p.action));
        }

        return Array.from(permissions);
    }
}
