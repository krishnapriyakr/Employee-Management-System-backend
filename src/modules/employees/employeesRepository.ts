import EmployeeModel, { IEmployee } from '../../models/EmployeeModel';

export const createEmployee = async (employeeData: any, createdBy: string): Promise<IEmployee> => {
  return await EmployeeModel.create({
    ...employeeData,
    createdBy
  });
};

export const updateEmployee = async (id: string, updateData: any): Promise<IEmployee | null> => {
  return await EmployeeModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');
};

export const findEmployeeById = async (id: string): Promise<IEmployee | null> => {
  return await EmployeeModel.findById(id).populate('createdBy', 'name email');
};

export const findEmployeeByEmail = async (email: string): Promise<IEmployee | null> => {
  return await EmployeeModel.findOne({ 'personalInfo.email': email });
};

export const findAllEmployees = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  department: string = ''
): Promise<{ employees: IEmployee[]; total: number; pages: number }> => { 
  const query: any = {};

  if (search) {
    query.$or = [
      { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
      { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
      { 'personalInfo.email': { $regex: search, $options: 'i' } },
      { 'employmentInfo.employeeId': { $regex: search, $options: 'i' } }
    ];
  }

  if (department) {
    query['employmentInfo.department'] = department;
  }

  const total = await EmployeeModel.countDocuments(query);
  const employees = await EmployeeModel.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    employees,
    total,
    pages: Math.ceil(total / limit)
  };
};

export const deleteEmployee = async (id: string): Promise<IEmployee | null> => {
  return await EmployeeModel.findByIdAndDelete(id);
};

export const getDashboardStats = async (): Promise<{
  totalEmployees: number;
  activeEmployees: number;
  departments: { [key: string]: number };
}> => {
  const totalEmployees = await EmployeeModel.countDocuments();
  const activeEmployees = await EmployeeModel.countDocuments({ 'employmentInfo.status': 'active' });
  
  const departmentStats = await EmployeeModel.aggregate([
    {
      $group: {
        _id: '$employmentInfo.department',
        count: { $sum: 1 }
      }
    }
  ]);

  const departments = departmentStats.reduce((acc: any, curr: any) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  return {
    totalEmployees,
    activeEmployees,
    departments
  };
};