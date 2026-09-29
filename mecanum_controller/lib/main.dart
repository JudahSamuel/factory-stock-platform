import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';

void main() {
  runApp(const MecanumApp());
}

class MecanumApp extends StatelessWidget {
  const MecanumApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Mecanum Controller',
      theme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
      ),
      home: const ControllerPage(),
    );
  }
}

class ControllerPage extends StatefulWidget {
  const ControllerPage({super.key});

  @override
  State<ControllerPage> createState() => _ControllerPageState();
}

class _ControllerPageState extends State<ControllerPage> {
  // ==========================================================
  // ESP32
  // ==========================================================

  final String robotIP = '192.168.4.1';

  bool connected = false;

  // ==========================================================
  // JOYSTICK
  // ==========================================================

  double joystickX = 0.0;
  double joystickY = 0.0;

  // ==========================================================
  // ROTATION
  // ==========================================================

  double rotation = 0.0;

  // ==========================================================
  // SPEED
  // ==========================================================

  double speed = 0.5;

  // ==========================================================
  // JOYSTICK SETTINGS
  // ==========================================================

  static const double joystickSize = 300.0;

  // Center dead-zone
  static const double deadZone = 0.08;

  // Response curve
  static const double responseCurve = 1.6;

  Timer? commandTimer;

  // ==========================================================
  // SEND COMMAND
  // ==========================================================

  Future<void> sendCommand() async {
    try {
      final client = HttpClient();

      final uri = Uri.parse(
        'http://$robotIP/cmd'
        '?x=${joystickX.toStringAsFixed(3)}'
        '&y=${joystickY.toStringAsFixed(3)}'
        '&r=${rotation.toStringAsFixed(3)}'
        '&speed=${speed.toStringAsFixed(3)}',
      );

      final request = await client.getUrl(uri);

      final response = await request.close();

      if (response.statusCode == 200) {
        if (!connected && mounted) {
          setState(() {
            connected = true;
          });
        }
      }

      client.close();
    } catch (_) {
      if (connected && mounted) {
        setState(() {
          connected = false;
        });
      }
    }
  }

  // ==========================================================
  // STOP
  // ==========================================================

  Future<void> stopRobot() async {
    joystickX = 0;
    joystickY = 0;
    rotation = 0;

    try {
      final client = HttpClient();

      final request = await client.getUrl(
        Uri.parse('http://$robotIP/stop'),
      );

      await request.close();

      client.close();
    } catch (_) {}

    if (mounted) {
      setState(() {});
    }
  }

  // ==========================================================
  // COMMAND LOOP
  // ==========================================================

  void startCommandLoop() {
    commandTimer?.cancel();

    commandTimer = Timer.periodic(
      const Duration(milliseconds: 50),
      (_) {
        if (
          joystickX.abs() > 0.001 ||
          joystickY.abs() > 0.001 ||
          rotation.abs() > 0.001
        ) {
          sendCommand();
        }
      },
    );
  }

  // ==========================================================
  // JOYSTICK MOVEMENT
  // ==========================================================

  void updateJoystick(
    Offset position,
    double size,
  ) {
    final center = Offset(
      size / 2,
      size / 2,
    );

    Offset delta = position - center;

    final maxDistance = size / 2 - 42;

    // Circular boundary
    if (delta.distance > maxDistance) {
      delta = Offset(
        delta.dx / delta.distance * maxDistance,
        delta.dy / delta.distance * maxDistance,
      );
    }

    double x = delta.dx / maxDistance;

    double y = -delta.dy / maxDistance;

    // ========================================================
    // DEAD ZONE
    // ========================================================

    final magnitude =
        sqrt2D(x, y);

    if (magnitude < deadZone) {
      x = 0;
      y = 0;
    } else {

      // Remove dead-zone smoothly
      final adjusted =
          (magnitude - deadZone) /
          (1.0 - deadZone);

      final scale =
          adjusted / magnitude;

      x *= scale;
      y *= scale;
    }

    // ========================================================
    // RESPONSE CURVE
    // ========================================================

    x = applyCurve(x);
    y = applyCurve(y);

    setState(() {
      joystickX = x;
      joystickY = y;
    });
  }

  // ==========================================================
  // RESPONSE CURVE
  // ==========================================================

  double applyCurve(double value) {
    if (value == 0) {
      return 0;
    }

    final sign =
        value < 0 ? -1.0 : 1.0;

    return sign *
        powDouble(
          value.abs(),
          responseCurve,
        );
  }

  // ==========================================================
  // RESET JOYSTICK
  // ==========================================================

  void resetJoystick() {
    setState(() {
      joystickX = 0;
      joystickY = 0;
    });

    sendCommand();
  }

  // ==========================================================
  // ROTATION
  // ==========================================================

  void startRotate(double direction) {
    setState(() {
      rotation = direction;
    });

    sendCommand();
  }

  void stopRotate() {
    setState(() {
      rotation = 0;
    });

    sendCommand();
  }

  // ==========================================================
  // CONNECTION CHECK
  // ==========================================================

  Future<void> checkConnection() async {
    try {
      final client = HttpClient();

      final request = await client.getUrl(
        Uri.parse('http://$robotIP/status'),
      );

      final response = await request.close();

      final body =
          await response
              .transform(utf8.decoder)
              .join();

      client.close();

      if (mounted) {
        setState(() {
          connected =
              response.statusCode == 200 &&
              body.contains('connected');
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          connected = false;
        });
      }
    }
  }

  // ==========================================================
  // LIFECYCLE
  // ==========================================================

  @override
  void initState() {
    super.initState();

    startCommandLoop();

    checkConnection();
  }

  @override
  void dispose() {
    commandTimer?.cancel();

    super.dispose();
  }

  // ==========================================================
  // UI
  // ==========================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFF0D0F12),

      appBar: AppBar(
        backgroundColor:
            const Color(0xFF15181D),

        title: const Text(
          'Mecanum Controller',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),

        centerTitle: true,

        actions: [
          Padding(
            padding:
                const EdgeInsets.only(right: 16),

            child: Row(
              children: [
                Icon(
                  Icons.circle,
                  size: 11,
                  color: connected
                      ? Colors.green
                      : Colors.red,
                ),

                const SizedBox(width: 6),

                Text(
                  connected
                      ? 'ONLINE'
                      : 'OFFLINE',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),

      body: SafeArea(
        child: Column(
          children: [

            const SizedBox(height: 12),

            // ==================================================
            // ROBOT INFO
            // ==================================================

            Text(
              'MecanumBot',
              style: TextStyle(
                color: Colors.grey.shade300,
                fontSize: 15,
                fontWeight:
                    FontWeight.w600,
              ),
            ),

            Text(
              '192.168.4.1',
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 11,
              ),
            ),

            const SizedBox(height: 12),

            // ==================================================
            // JOYSTICK
            // ==================================================

            Expanded(
              child: Center(
                child: GestureDetector(

                  onPanStart: (details) {
                    updateJoystick(
                      details.localPosition,
                      joystickSize,
                    );
                  },

                  onPanUpdate: (details) {
                    updateJoystick(
                      details.localPosition,
                      joystickSize,
                    );
                  },

                  onPanEnd: (_) {
                    resetJoystick();
                  },

                  child: Container(
                    width: joystickSize,
                    height: joystickSize,

                    decoration:
                        BoxDecoration(
                      shape: BoxShape.circle,

                      color:
                          const Color(0xFF171A20),

                      border: Border.all(
                        color:
                            const Color(0xFF30343D),
                        width: 2,
                      ),

                      boxShadow: const [
                        BoxShadow(
                          blurRadius: 30,
                          spreadRadius: 3,
                          color: Colors.black54,
                        ),
                      ],
                    ),

                    child: CustomPaint(
                      painter:
                          JoystickPainter(
                        x: joystickX,
                        y: joystickY,
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // ==================================================
            // VALUES
            // ==================================================

            Text(
              'X ${joystickX.toStringAsFixed(2)}'
              '     '
              'Y ${joystickY.toStringAsFixed(2)}'
              '     '
              'R ${rotation.toStringAsFixed(2)}',
              style: TextStyle(
                color: Colors.grey.shade500,
                fontSize: 11,
              ),
            ),

            const SizedBox(height: 8),

            // ==================================================
            // ROTATION
            // ==================================================

            Row(
              mainAxisAlignment:
                  MainAxisAlignment.center,

              children: [

                GestureDetector(

                  onLongPressStart: (_) {
                    startRotate(-1);
                  },

                  onLongPressEnd: (_) {
                    stopRotate();
                  },

                  child: controlButton(
                    Icons.rotate_left,
                    'ROTATE LEFT',
                  ),
                ),

                const SizedBox(width: 25),

                GestureDetector(

                  onLongPressStart: (_) {
                    startRotate(1);
                  },

                  onLongPressEnd: (_) {
                    stopRotate();
                  },

                  child: controlButton(
                    Icons.rotate_right,
                    'ROTATE RIGHT',
                  ),
                ),
              ],
            ),

            const SizedBox(height: 8),

            // ==================================================
            // SPEED
            // ==================================================

            Padding(
              padding:
                  const EdgeInsets.symmetric(
                horizontal: 25,
              ),

              child: Row(
                children: [

                  const Icon(
                    Icons.speed,
                    size: 20,
                  ),

                  const SizedBox(width: 8),

                  Expanded(
                    child: Slider(
                      value: speed,

                      min: 0.15,

                      max: 1.0,

                      divisions: 17,

                      label:
                          '${(speed * 100).round()}%',

                      onChanged: (value) {
                        setState(() {
                          speed = value;
                        });

                        sendCommand();
                      },
                    ),
                  ),

                  SizedBox(
                    width: 45,

                    child: Text(
                      '${(speed * 100).round()}%',
                      textAlign:
                          TextAlign.right,

                      style:
                          const TextStyle(
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ==================================================
            // STOP
            // ==================================================

            Padding(
              padding:
                  const EdgeInsets.fromLTRB(
                22,
                2,
                22,
                15,
              ),

              child: SizedBox(
                width: double.infinity,
                height: 58,

                child: ElevatedButton(
                  onPressed: stopRobot,

                  style:
                      ElevatedButton.styleFrom(
                    backgroundColor:
                        Colors.red.shade700,

                    foregroundColor:
                        Colors.white,

                    elevation: 5,

                    shape:
                        RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(
                        16,
                      ),
                    ),
                  ),

                  child: const Row(
                    mainAxisAlignment:
                        MainAxisAlignment.center,

                    children: [

                      Icon(
                        Icons.stop_circle,
                        size: 27,
                      ),

                      SizedBox(width: 9),

                      Text(
                        'EMERGENCY STOP',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight:
                              FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================================
  // BUTTON
  // ==========================================================

  Widget controlButton(
    IconData icon,
    String text,
  ) {
    return Container(
      width: 135,
      height: 60,

      decoration: BoxDecoration(
        color:
            const Color(0xFF1C2027),

        borderRadius:
            BorderRadius.circular(15),

        border: Border.all(
          color:
              const Color(0xFF343943),
        ),
      ),

      child: Column(
        mainAxisAlignment:
            MainAxisAlignment.center,

        children: [
          Icon(icon),

          const SizedBox(height: 2),

          Text(
            text,
            style: const TextStyle(
              fontSize: 10,
              fontWeight:
                  FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================
// JOYSTICK PAINTER
// ============================================================

class JoystickPainter
    extends CustomPainter {

  final double x;
  final double y;

  JoystickPainter({
    required this.x,
    required this.y,
  });

  @override
  void paint(
    Canvas canvas,
    Size size,
  ) {
    final center = Offset(
      size.width / 2,
      size.height / 2,
    );

    final radius =
        size.width / 2;

    // ========================================================
    // GRID
    // ========================================================

    final gridPaint = Paint()
      ..color =
          const Color(0xFF292D35)
      ..strokeWidth = 1.5;

    canvas.drawLine(
      Offset(center.dx, 25),
      Offset(center.dx,
          size.height - 25),
      gridPaint,
    );

    canvas.drawLine(
      Offset(25, center.dy),
      Offset(size.width - 25,
          center.dy),
      gridPaint,
    );

    // ========================================================
    // DIAGONAL GUIDES
    // ========================================================

    canvas.drawLine(
      Offset(65, 65),
      Offset(size.width - 65,
          size.height - 65),
      gridPaint,
    );

    canvas.drawLine(
      Offset(size.width - 65, 65),
      Offset(65,
          size.height - 65),
      gridPaint,
    );

    // ========================================================
    // OUTER RING
    // ========================================================

    final ringPaint = Paint()
      ..color =
          const Color(0xFF343944)
      ..style =
          PaintingStyle.stroke
      ..strokeWidth = 2;

    canvas.drawCircle(
      center,
      radius - 40,
      ringPaint,
    );

    // ========================================================
    // JOYSTICK POSITION
    // ========================================================

    final maxDistance =
        radius - 42;

    final knobPosition =
        Offset(
      center.dx + x * maxDistance,
      center.dy - y * maxDistance,
    );

    // ========================================================
    // KNOB
    // ========================================================

    final knobPaint = Paint()
      ..color =
          const Color(0xFF3F8CFF);

    canvas.drawCircle(
      knobPosition,
      34,
      knobPaint,
    );

    // ========================================================
    // KNOB HIGHLIGHT
    // ========================================================

    final highlightPaint = Paint()
      ..color =
          Colors.white.withOpacity(0.15);

    canvas.drawCircle(
      knobPosition.translate(-9, -9),
      11,
      highlightPaint,
    );

    // ========================================================
    // CENTER DOT
    // ========================================================

    final centerPaint = Paint()
      ..color =
          Colors.white24;

    canvas.drawCircle(
      center,
      5,
      centerPaint,
    );
  }

  @override
  bool shouldRepaint(
    covariant JoystickPainter oldDelegate,
  ) {
    return oldDelegate.x != x ||
        oldDelegate.y != y;
  }
}

// ============================================================
// SIMPLE MATH FUNCTIONS
// ============================================================

double sqrt2D(double x, double y) {
  return (x * x + y * y).sqrt();
}

double powDouble(double base, double exponent) {
  return base == 0
      ? 0
      : double.parse(
          '${base.abs()}',
        ).pow(exponent) *
          (base < 0 ? -1 : 1);
}

// Extensions
extension DoubleMath on double {
  double sqrt() {
    if (this <= 0) return 0;

    double x = this;

    double result = x;

    for (int i = 0; i < 10; i++) {
      result =
          0.5 * (result + x / result);
    }

    return result;
  }

  double pow(double exponent) {
    return _power(this, exponent);
  }
}

double _power(
  double base,
  double exponent,
) {
  return expApprox(
    exponent * lnApprox(base),
  );
}

double lnApprox(double x) {
  // Good enough for joystick response curve
  double y =
      (x - 1) / (x + 1);

  double y2 = y * y;

  double sum = y;

  double term = y;

  for (int n = 3; n <= 19; n += 2) {
    term *= y2;
    sum += term / n;
  }

  return 2 * sum;
}

double expApprox(double x) {
  double sum = 1;
  double term = 1;

  for (int i = 1; i <= 20; i++) {
    term *= x / i;
    sum += term;
  }

  return sum;
}