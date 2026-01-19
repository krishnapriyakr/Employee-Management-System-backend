import * as employeesRepository from './employeesRepository';

export const createEmployee = async (employeeData: any, createdBy: string) => {
  try {
    // Check if email already exists
    const existingEmployee = await employeesRepository.findEmployeeByEmail(employeeData.personalInfo.email);
    if (existingEmployee) {
      return {
        success: false,
        message: 'Employee with this email already exists'
      };
    }

    const employee = await employeesRepository.createEmployee(employeeData, createdBy);
    
    return {
      success: true,
      message: 'Employee created successfully',
      data: employee
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error creating employee',
      error: error.message
    };
  }
};

export const updateEmployee = async (id: string, updateData: any) => {
  try {
    const employee = await employeesRepository.updateEmployee(id, updateData);
    
    if (!employee) {
      return {
        success: false,
        message: 'Employee not found'
      };
    }

    return {
      success: true,
      message: 'Employee updated successfully',
      data: employee
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error updating employee',
      error: error.message
    };
  }
};

export const getEmployeeById = async (id: string) => {
  try {
    const employee = await employeesRepository.findEmployeeById(id);
    
    if (!employee) {
      return {
        success: false,
        message: 'Employee not found'
      };
    }

    return {
      success: true,
      message: 'Employee fetched successfully',
      data: employee
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching employee',
      error: error.message
    };
  }
};

export const getAllEmployees = async (page: number = 1, limit: number = 10, search: string = '', department: string = '') => {
  try {
    const result = await employeesRepository.findAllEmployees(page, limit, search, department);
    
    return {
      success: true,
      message: 'Employees fetched successfully',
      data: {
        employees: result.employees,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: result.pages
        }
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching employees',
      error: error.message
    };
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const employee = await employeesRepository.deleteEmployee(id);
    
    if (!employee) {
      return {
        success: false,
        message: 'Employee not found'
      };
    }

    return {
      success: true,
      message: 'Employee deleted successfully',
      data: employee
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error deleting employee',
      error: error.message
    };
  }
};

export const getDashboardStats = async () => {
  try {
    const stats = await employeesRepository.getDashboardStats();
    
    return {
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: stats
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    };
  }
};

export const findEmployeeByEmail = async (email: string) => {
  return await employeesRepository.findEmployeeByEmail(email);
};