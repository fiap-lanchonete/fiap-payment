import { Test, TestingModule } from '@nestjs/testing';

import { ProcessPaymentUseCase } from '../../../application/usecases/process-payment.usecase';
import { GetStatusPaymentUseCase } from '../../../application/usecases/get-status-payment.usecase';
import { ViewPaymentUseCase } from '../../../application/usecases/view-payment.usecase';
import { InternalServerErrorException } from '@nestjs/common';
import { PaymentController } from '../payment.controller';
import { UpdatePaymentUseCase } from '../../../application/usecases/update-payment.usecase';

// Mocking the use cases
jest.mock('../../../application/usecases/process-payment.usecase');
jest.mock('../../../application/usecases/get-status-payment.usecase');
jest.mock('../../../application/usecases/view-payment.usecase');
jest.mock('../../../application/usecases/update-payment.usecase');

describe('PaymentController', () => {
  let paymentController: PaymentController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let processPaymentUseCase: ProcessPaymentUseCase;
  let getStatusPaymentUseCase: GetStatusPaymentUseCase;
  let viewPaymentUseCase: ViewPaymentUseCase;

  beforeEach(async () => {
    // Initialize the testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        ProcessPaymentUseCase,
        GetStatusPaymentUseCase,
        ViewPaymentUseCase,
        UpdatePaymentUseCase
      ],
    }).compile();

    paymentController = module.get<PaymentController>(PaymentController);
    processPaymentUseCase = module.get<ProcessPaymentUseCase>(
      ProcessPaymentUseCase,
    );
    getStatusPaymentUseCase = module.get<GetStatusPaymentUseCase>(
      GetStatusPaymentUseCase,
    );
    viewPaymentUseCase = module.get<ViewPaymentUseCase>(ViewPaymentUseCase);
  });

  describe('getStatus', () => {
    it('should call getStatusPaymentUseCase.execute with the provided ID', async () => {
      const mockId = 'mockId';

      await paymentController.getStatus(null, mockId);

      expect(getStatusPaymentUseCase.execute).toHaveBeenCalledWith(mockId);
    });

    it('should return the result from getStatusPaymentUseCase', async () => {
      const expectedResult = { status: 'success' } as any;
      jest
        .spyOn(getStatusPaymentUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await paymentController.getStatus(null, 'mockId');

      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if an error occurs during status retrieval', async () => {
      const mockError = new Error('Mock error');
      jest
        .spyOn(getStatusPaymentUseCase, 'execute')
        .mockRejectedValue(mockError);

      await expect(
        paymentController.getStatus(null, 'mockId'),
      ).rejects.toThrowError(
        new InternalServerErrorException(mockError.message),
      );
    });
  });

  describe('getPayment', () => {
    it('should call viewPaymentUseCase.execute with the provided ID', async () => {
      const mockId = 'mockId';

      await paymentController.getPayment(null, mockId);

      expect(viewPaymentUseCase.execute).toHaveBeenCalledWith(mockId);
    });

    it('should return the result from viewPaymentUseCase', async () => {
      const expectedResult = { id: 'mockId', status: 'success' } as any;
      jest
        .spyOn(viewPaymentUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await paymentController.getPayment(null, 'mockId');

      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if an error occurs during payment retrieval', async () => {
      const mockError = new Error('Mock error');
      jest.spyOn(viewPaymentUseCase, 'execute').mockRejectedValue(mockError);

      await expect(
        paymentController.getPayment(null, 'mockId'),
      ).rejects.toThrowError(
        new InternalServerErrorException(mockError.message),
      );
    });
  });
});
